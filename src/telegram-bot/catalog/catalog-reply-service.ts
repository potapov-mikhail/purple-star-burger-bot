import { Context } from 'telegraf';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../common/di/tokens';
import { CatalogTemplate } from './catalog-template';
import { CatalogActionPrefix } from './catalog-actions';
import { CartActionPrefix } from '../cart/cart-actions';
import { IPagination } from '../../common/types/pagination';
import { PaginationTemplate } from '../templates/pagination-template';
import { IProductService } from '../../product/product.service.interface';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

@injectable()
export class CatalogReplyService {
	constructor(@inject(APP_TOKENS.ProductService) private productService: IProductService) {}

	async showBurgerList(ctx: Context, pagination: IPagination, replace = false): Promise<void> {
		const products = await this.productService.findAllBurgers(pagination);
		const template = CatalogTemplate.getBurgersList(products);
		const markup = PaginationTemplate.getPaginationMarkupTemplate(
			pagination.page,
			CatalogActionPrefix.burgerChangePage,
			false,
		);

		if (template) {
			this.replyList(ctx, template, markup, replace);
		} else {
			this.replyNotFound(ctx, pagination, CatalogActionPrefix.burgerChangePage, replace);
		}
	}

	async showDrinksList(ctx: Context, pagination: IPagination, replace = false): Promise<void> {
		const products = await this.productService.findAllDrinks(pagination);
		const template = CatalogTemplate.getDrinksList(products);
		const markup = PaginationTemplate.getPaginationMarkupTemplate(
			pagination.page,
			CatalogActionPrefix.drinkChangePage,
			false,
		);

		if (template) {
			this.replyList(ctx, template, markup, replace);
		} else {
			this.replyNotFound(ctx, pagination, CatalogActionPrefix.drinkChangePage, replace);
		}
	}

	async showBurgerCard(ctx: Context, id: number): Promise<void> {
		const burger = await this.productService.findById(id);
		let template = 'Бурген не найден';
		let keyboard: InlineKeyboardButton[][] = [];

		if (burger) {
			template = CatalogTemplate.getBurgerCard(burger);
			keyboard = [
				[
					{ text: '-', callback_data: `${CartActionPrefix.DeleteBurgerFromCart}-${burger.id}` },
					{ text: '+', callback_data: `${CartActionPrefix.AddBurgerToCart}-${burger.id}` },
				],
			];
		}

		await ctx.replyWithMarkdown(template, {
			reply_markup: {
				inline_keyboard: keyboard,
			},
		});
	}

	async showDrinkCard(ctx: Context, id: number): Promise<void> {
		const drink = await this.productService.findById(id);
		let template = 'Напиток не найден';
		let keyboard: InlineKeyboardButton[][] = [];

		if (drink) {
			template = CatalogTemplate.getDrinkCard(drink);
			keyboard = [
				[
					{ text: '-', callback_data: `${CartActionPrefix.DeleteDrinkFromCart}-${drink.id}` },
					{ text: '+', callback_data: `${CartActionPrefix.AddDrinkToCart}-${drink.id}` },
				],
			];
		}

		await ctx.replyWithMarkdown(template, {
			reply_markup: {
				inline_keyboard: keyboard,
			},
		});
	}

	private async replyList(
		ctx: Context,
		template: string,
		markup: InlineKeyboardButton[][],
		replace: boolean,
	): Promise<void> {
		if (replace) {
			await ctx.editMessageText(template, {
				reply_markup: {
					inline_keyboard: markup,
				},
			});
		} else {
			await ctx.replyWithMarkdown(template, {
				reply_markup: {
					inline_keyboard: markup,
				},
			});
		}
	}

	private async replyNotFound(
		ctx: Context,
		pagination: IPagination,
		prefix: string,
		replace: boolean,
	): Promise<void> {
		const text = '☹️Ничего не найдено';
		const markup = {
			reply_markup: {
				inline_keyboard: PaginationTemplate.getPaginationMarkupTemplate(
					pagination.page,
					prefix,
					true,
				),
			},
		};

		if (replace) {
			await ctx.editMessageText(text, markup);
		} else {
			await ctx.reply(text, markup);
		}
	}
}
