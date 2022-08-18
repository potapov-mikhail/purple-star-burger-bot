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
				handler: this.notImplementedDialog.bind(this),
			},

			{
				name: CartAction.DeleteBurgerFromCart,
				handler: this.notImplementedDialog.bind(this),
			},

			{
				name: CartAction.AddDrinkToCart,
				handler: this.notImplementedDialog.bind(this),
			},
			{
				name: CartAction.DeleteDrinkFromCart,
				handler: this.notImplementedDialog.bind(this),
			},
		]);
	}

	private async notImplemented(ctx: Context): Promise<void> {
		await ctx.reply('Not implemented');
	}

	private async notImplementedDialog(ctx: Context): Promise<void> {
		await ctx.answerCbQuery('Not implemented');
	}
}
