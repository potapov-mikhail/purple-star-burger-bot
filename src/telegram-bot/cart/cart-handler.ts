import { Context } from 'telegraf';
import { injectable } from 'inversify';
import { CartAction } from './cart-actions';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';

@injectable()
export class CartHandler extends TelegramBotHandler {
	constructor() {
		super();

		this.bindCommands([
			{
				name: CartAction.Cart,
				handler: this.notImplemented.bind(this),
			},
		]);

		this.bindActions([
			{
				name: CartAction.AddBurgerToCart,
				handler: this.notImplemented.bind(this),
			},

			{
				name: CartAction.DeleteBurgerFromCart,
				handler: this.notImplemented.bind(this),
			},

			{
				name: CartAction.AddDrinkToCart,
				handler: this.notImplemented.bind(this),
			},
			{
				name: CartAction.DeleteDrinkFromCart,
				handler: this.notImplemented.bind(this),
			},
		]);
	}

	private async notImplemented(ctx: Context): Promise<void> {
		ctx.reply('Not implemented');
	}
}
