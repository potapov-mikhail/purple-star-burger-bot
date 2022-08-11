import { inject, injectable } from 'inversify';
import { Middleware, Context, Composer } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { OrderTelegramBotController } from '../order/order-telegram-bot-controller';
import { ProductTelegramBotController } from '../product/product-telegram-bot-controller';
import { ProfileTelegramBotController } from '../profile/profile-telegram-bot-controller';
import { parseId } from '../utils/parse-id';
import { ITelegramBotHandler } from './telegram-bot-handler.interface';

@injectable()
export class TelegramBotHandler implements ITelegramBotHandler {
	private readonly composer = new Composer();

	constructor(
		@inject(DI_APP_TOKENS.ProductTelegramBotController)
		private productTelegramBotController: ProductTelegramBotController,
		@inject(DI_APP_TOKENS.ProfileTelegramBotController)
		private profileTelegramBotController: ProfileTelegramBotController,
		@inject(DI_APP_TOKENS.OrderTelegramBotController)
		private orderTelegramBotController: OrderTelegramBotController,
	) {
		this.composer.command('start', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('help', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('burgers', (ctx) => {
			this.productTelegramBotController.showBurgerList(ctx, { page: 1, limit: 10 });
		});

		this.composer.hears(/burger+[0-9]*/, (ctx) => {
			const id = parseId(ctx.match[0]);
			if (id) {
				this.productTelegramBotController.showBurgerCard(ctx, id);
			}
		});

		this.composer.command('drinks', (ctx) => {
			this.productTelegramBotController.showDrinksList(ctx, { page: 1, limit: 10 });
		});

		this.composer.hears(/drink+[0-9]*/, (ctx) => {
			const id = parseId(ctx.match[0]);
			if (id) {
				this.productTelegramBotController.showDrinkCard(ctx, 1);
			}
		});

		this.composer.command('cart', (ctx) => {
			ctx.reply(`Cart`);
		});

		this.composer.command('profile', async (ctx) => {
			this.profileTelegramBotController.showProfile(ctx, ctx.from.id);
		});

		this.composer.command('addresses', async (ctx) => {
			this.profileTelegramBotController.showAddressList(ctx, ctx.from.id);
		});

		this.composer.command('addaddress', async (ctx) => {
			ctx.reply('Add address');
		});

		this.composer.command('deleteaddress', async (ctx) => {
			ctx.reply('Delete address');
		});

		this.composer.command('editaddress', async (ctx) => {
			ctx.reply('Edit address');
		});

		this.composer.command('orders', (ctx) => {
			this.orderTelegramBotController.showOrderList(ctx, ctx.from.id);
		});
	}

	middleware(): Middleware<Context<Update>> {
		return this.composer;
	}
}
