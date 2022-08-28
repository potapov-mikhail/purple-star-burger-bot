import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { ProductService } from '../../domains/product/product.service';
import { ILoggerService } from '../../common/logger/logger.interface';
import { TG_TRIGGERS } from '../telegram-bot-triggers';
import { TelegramBotHandler } from '../common/telegram-bot-handler/telegram-bot-handler';
import { TgCartService } from '../services/cart-store.service';
import { CartTemplate } from '../templates/cart-template';
import { MarkupTemplate } from '../templates/markup-template';

@injectable()
export class CartHandler extends TelegramBotHandler {
	constructor(
		@inject(APP_TOKENS.LoggerService) readonly loggerService: ILoggerService,
		@inject(APP_TOKENS.ProductService) readonly productService: ProductService,
		@inject(APP_TOKENS.TgCartService) readonly tgCartService: TgCartService,
	) {
		super();
		this.loggerService.setPrefix(this.constructor.name);

		this.composer.command(TG_TRIGGERS.Cart, async (ctx) => {
			const items = this.tgCartService.getProductsFromCart(ctx);
			const ids = Object.keys(items).map(Number);
			const products = await this.productService.getProductsByIds(ids);
			const productsWithCount = products.map((product) => {
				return { product, count: items[product.id] };
			});
			const template = CartTemplate.getCart(productsWithCount);
			const extra = MarkupTemplate.getCartOptions();

			await ctx.reply(template, productsWithCount.length ? extra : undefined);
		});
	}
}
