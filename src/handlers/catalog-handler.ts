import { ProductType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../container/tokens';
import { TGNotFound } from '../errors/tg-not-found';
import { ProductService } from '../services/product.service';
import { MarkupTemplate } from '../templates/markup-template';
import { ProductTemplate } from '../templates/catalog-template';
import { ILoggerService } from '../common/logger/logger.interface';
import { TG_TRIGGERS } from '../telegram-bot/telegram-bot-triggers';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';
import { ITelegramBotExtraView } from '../common/telegram-bot.interface';
import { TelegramBotHandler } from '../common/telegram-bot-handler/telegram-bot-handler';

@injectable()
export class CatalogHandler extends TelegramBotHandler {
	constructor(
		@inject(APP_TOKENS.LoggerService) readonly loggerService: ILoggerService,
		@inject(APP_TOKENS.ProductService) readonly productService: ProductService,
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
				const productId = this.getProductCardId(ctx.match[0]);
				if (!productId) {
					throw new TGNotFound();
				}

				const product = await this.productService.getProductsById(productId);

				if (!product) {
					throw new TGNotFound();
				}
				const template = ProductTemplate.getProductCard(product);
				await ctx.replyWithMarkdown(template);
			},
		);
	}

	async getProductListView(type: ProductType, page: number): Promise<ITelegramBotExtraView> {
		const { items, pagination } = await this.productService.getProductsByType(type, page);
		const trigger = type === 'Burger' ? TG_TRIGGERS.BurgerChangePage : TG_TRIGGERS.DrinkChangePage;
		const template = ProductTemplate.getProductList(items);
		const extra = MarkupTemplate.getPagination(pagination, trigger.prefix);
		return { template, extra: { ...extra, parse_mode: 'Markdown' } };
	}

	private getProductCardId(str: string): number | null {
		const id = str.match(/\d+/g);
		return id ? Number(id) : null;
	}

	private getProductListParams(str: string): { page: number; type: ProductType } {
		const [prefix, page] = str.split('-');
		const type = prefix === TG_TRIGGERS.BurgerChangePage.prefix ? 'Burger' : 'Drink';
		return { type, page: Number(page) };
	}
}
