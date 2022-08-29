import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { ProductService } from '../../domains/product/product.service';
import { ILoggerService } from '../../common/logger/logger.interface';
import { TG_TRIGGERS } from '../telegram-bot-triggers';
import { TelegramBotHandler } from '../common/telegram-bot-handler/telegram-bot-handler';
import { TgCartService } from '../services/cart-store.service';
import { CartTemplate } from '../templates/cart-template';
import { MarkupTemplate } from '../templates/markup-template';
import { IConfigService } from '../../common/config/config.interface';
import { OrderService } from '../../domains/order/order.service';
import { OrderEntity } from '../../domains/order/order.entity';
import { TGNotFound } from '../errors/tg-not-found';
import { OrderStatus } from '@prisma/client';

@injectable()
export class CartHandler extends TelegramBotHandler {
	private readonly providerToken: string;

	constructor(
		@inject(APP_TOKENS.LoggerService) readonly loggerService: ILoggerService,
		@inject(APP_TOKENS.ProductService) readonly productService: ProductService,
		@inject(APP_TOKENS.TgCartService) readonly tgCartService: TgCartService,
		@inject(APP_TOKENS.ConfigService) readonly configService: IConfigService,
		@inject(APP_TOKENS.OrderService) readonly orderService: OrderService,
	) {
		super();
		this.loggerService.setPrefix(this.constructor.name);
		this.providerToken = this.configService.get('TG_PROVIDER_TOKEN');

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

		this.composer.action(TG_TRIGGERS.Pay.pattern, async (ctx) => {
			const items = this.tgCartService.getProductsFromCart(ctx);
			const ids = Object.keys(items).map(Number);
			const products = await this.productService.getProductsByIds(ids);
			const productsWithCount = products.map((product) => {
				return { product, count: items[product.id] };
			});

			if (!productsWithCount.length) {
				await ctx.reply('😌 У вас нет товара для оплаты');
				return;
			}

			const orderEntity = new OrderEntity();
			for (const item of productsWithCount) {
				orderEntity.addItem({
					id: item.product.id,
					name: item.product.name,
					price: item.product.price,
					count: item.count,
				});
			}

			const order = await this.orderService.createOrder(orderEntity);

			await ctx.replyWithInvoice({
				provider_token: this.providerToken,
				title: 'Purple Start Счет',
				description: '😜 Осталось только оплатить и мы удалим ваш голод и жажду!',
				payload: JSON.stringify({ orderId: order.id.toString() }),
				currency: 'RUB',
				prices: orderEntity.getLabeledPrices(),
				start_parameter: 'test_bot',
			});
		});

		this.composer.on('pre_checkout_query', async (ctx) => {
			const payload = JSON.parse(ctx.preCheckoutQuery.invoice_payload) as { orderId: string };
			const order = await this.orderService.getOrderById(+payload.orderId);

			if (!order) {
				throw new TGNotFound('😮 Упс! Заказ не найден');
			}

			await this.orderService.updateOrderStatusById(order.id, OrderStatus.Approved);
			await ctx.answerPreCheckoutQuery(true);
		});

		this.composer.on('successful_payment', async (ctx) => {
			const payment = ctx.message.successful_payment;
			const payload = JSON.parse(payment.invoice_payload) as { orderId: string };
			const order = await this.orderService.getOrderById(+payload.orderId);

			if (!order) {
				throw new TGNotFound('😮 Упс! Заказ не найден');
			}

			await this.orderService.updateOrderStatusById(order.id, OrderStatus.Paid);
			await ctx.reply('😀 Вы успешно оплатили заказ!');
		});
	}
}
