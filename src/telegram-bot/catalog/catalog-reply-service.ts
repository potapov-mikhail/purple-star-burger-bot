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

	async showBurgerList(ctx: Context, pagination: IPagination): Promise<void> {
		const products = await this.productService.findAllBurgers(pagination);
		const template = CatalogTemplate.getBurgersList(products);
		const markup = PaginationTemplate.getPaginationMarkupTemplate(
			pagination.page,
			CatalogActionPrefix.burgerChangePage,
			false,
		);

		if (template) {
			await ctx.replyWithMarkdown(template, {
				reply_markup: {
					inline_keyboard: markup,
				},
			});
		} else {
			await ctx.reply('Ничего не найдено');
		}
	}

	async replaceBurgerList(ctx: Context, pagination: IPagination): Promise<void> {
		const products = await this.productService.findAllBurgers(pagination);
		const template = CatalogTemplate.getBurgersList(products);
		const markup = PaginationTemplate.getPaginationMarkupTemplate(
			pagination.page,
			CatalogActionPrefix.burgerChangePage,
			false,
		);

		if (template) {
			await ctx.editMessageText(template, {
				reply_markup: {
					inline_keyboard: markup,
				},
			});
		} else {
			await ctx.editMessageText('Ничего не найдено', {
				reply_markup: {
					inline_keyboard: PaginationTemplate.getPaginationMarkupTemplate(
						pagination.page,
						CatalogActionPrefix.burgerChangePage,
						true,
					),
				},
			});
		}
	}

	async showDrinksList(ctx: Context, pagination: IPagination): Promise<void> {
		const drinks = await this.productService.findAllDrinks(pagination);
		const template = CatalogTemplate.getDrinksList(drinks);
		const markup = PaginationTemplate.getPaginationMarkupTemplate(
			pagination.page,
			CatalogActionPrefix.drinkChangePage,
			false,
		);

		if (template) {
			await ctx.replyWithMarkdown(template, {
				reply_markup: {
					inline_keyboard: markup,
				},
			});
		} else {
			await ctx.reply('Ничего не найдено');
		}
	}

	async replaceDrinksList(ctx: Context, pagination: IPagination): Promise<void> {
		const drinks = await this.productService.findAllDrinks(pagination);
		const template = CatalogTemplate.getDrinksList(drinks);
		const markup = PaginationTemplate.getPaginationMarkupTemplate(
			pagination.page,
			CatalogActionPrefix.drinkChangePage,
			false,
		);

		if (template) {
			await ctx.editMessageText(template, {
				reply_markup: {
					inline_keyboard: markup,
				},
			});
		} else {
			await ctx.editMessageText('Ничего не найдено', {
				reply_markup: {
					inline_keyboard: PaginationTemplate.getPaginationMarkupTemplate(
						pagination.page,
						CatalogActionPrefix.drinkChangePage,
						true,
					),
				},
			});
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
				inline_keyboard: keyboard as InlineKeyboardButton[][],
			},
		});
	}

	async showDrinkCard(ctx: Context, id: number): Promise<void> {
		const drink = await this.productService.findById(id);
		let template = 'Напиток не найден';

		if (drink) {
			template = CatalogTemplate.getDrinkCard(drink);
		}

		await ctx.replyWithMarkdown(template);
	}
}
