import { Product, ProductCategory } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { TGNotFound } from '../errors/tg-not-found';
import { ProductService } from '../../domains/product/product.service';
import { MarkupTemplate } from '../templates/markup-template';
import { ProductTemplate } from '../templates/catalog-template';
import { ILoggerService } from '../../common/logger/logger.interface';
import { TG_TRIGGERS } from '../telegram-bot-triggers';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { TelegramBotHandler } from '../common/telegram-bot-handler/telegram-bot-handler';
import { ITelegramBotExtraView, ITgContext } from '../common/telegram-bot.interface';
import { TgCartService } from '../services/cart-store.service';

@injectable()
export class CatalogHandler extends TelegramBotHandler {
	constructor(
		@inject(APP_TOKENS.LoggerService) readonly loggerService: ILoggerService,
		@inject(APP_TOKENS.ProductService) readonly productService: ProductService,
		@inject(APP_TOKENS.TgCartService) readonly tgCartService: TgCartService,
	) {
		super();
		this.loggerService.setPrefix(this.constructor.name);

		this.composer.command(TG_TRIGGERS.BurgerList, async (ctx) => {
			const { template, extra } = await this.getProductListView('Burger', 1);
			await ctx.reply(template, extra);
		});

		this.composer.command(TG_TRIGGERS.DrinkList, async (ctx) => {
			const { template, extra } = await this.getProductListView('Drink', 1);
			await ctx.reply(template, extra);
		});

		this.composer.action(
			[TG_TRIGGERS.BurgerChangePage.pattern, TG_TRIGGERS.DrinkChangePage.pattern],
			async (ctx) => {
				if (ctx.callbackQuery.data) {
					const { type, page } = this.getProductListParams(ctx.callbackQuery.data);
					const { template, extra } = await this.getProductListView(type, page);
					await ctx.editMessageText(template, extra as ExtraEditMessageText);
				}
			},
		);

		this.composer.hears(
			[TG_TRIGGERS.BurgerCard.pattern, TG_TRIGGERS.DrinkCard.pattern],
			async (ctx) => {
				const product = await this.getProductFromParamsOrThrow(ctx, ctx.match[0]);
				const { template, extra } = await this.getProductCartView(ctx, product);
				await ctx.replyWithMarkdown(template, extra);
			},
		);

		this.composer.action(TG_TRIGGERS.AddToCart.pattern, async (ctx) => {
			const product = await this.getProductFromParamsOrThrow(ctx, ctx.callbackQuery.data ?? '');
			this.tgCartService.addProductToCart(ctx, product.id);
			const { template, extra } = await this.getProductCartView(ctx, product);
			await ctx.editMessageText(template, extra as ExtraEditMessageText);
			await ctx.answerCbQuery('Добавлен в корзину');
		});

		this.composer.action(TG_TRIGGERS.DeleteFromCart.pattern, async (ctx) => {
			const product = await this.getProductFromParamsOrThrow(ctx, ctx.callbackQuery.data ?? '');
			this.tgCartService.deleteProductFromCart(ctx, product.id);
			const { template, extra } = await this.getProductCartView(ctx, product);
			await ctx.editMessageText(template, extra as ExtraEditMessageText);
			await ctx.answerCbQuery('Удален из корзины');
		});
	}

	async getProductListView(type: ProductCategory, page: number): Promise<ITelegramBotExtraView> {
		const { items, pagination } = await this.productService.getProductsByCategory(type, page);
		const trigger = type === 'Burger' ? TG_TRIGGERS.BurgerChangePage : TG_TRIGGERS.DrinkChangePage;
		const template = ProductTemplate.getProductList(items);
		const extra = MarkupTemplate.getPagination(pagination, trigger.prefix);
		return { template, extra: { ...extra, parse_mode: 'Markdown' } };
	}

	async getProductCartView(ctx: ITgContext, product: Product): Promise<ITelegramBotExtraView> {
		const count = this.tgCartService.getProductCount(ctx, product.id);
		const template = ProductTemplate.getProductCard(product);
		const extra = MarkupTemplate.getProductOptions(product, count);
		return { template, extra: { ...extra, parse_mode: 'Markdown' } };
	}

	private getProductCardId(str: string): number | null {
		const id = Number(str.match(/\d+/g));
		return Number.isInteger(id) ? id : null;
	}

	private getProductListParams(str: string): { page: number; type: ProductCategory } {
		const [prefix, page] = str.split('-');
		const type = prefix === TG_TRIGGERS.BurgerChangePage.prefix ? 'Burger' : 'Drink';
		return { type, page: Number(page) };
	}

	private async getProductFromParamsOrThrow(ctx: ITgContext, match: string): Promise<Product> {
		const productId = this.getProductCardId(match);

		if (!productId) {
			throw new TGNotFound();
		}

		const product = await this.productService.getProductsById(productId);

		if (!product) {
			throw new TGNotFound();
		}

		return product;
	}
}
