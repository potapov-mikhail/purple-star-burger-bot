import { injectable } from 'inversify';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { CartAction } from './cart-actions';

@injectable()
export class CartHandler extends TelegramBotHandler {
	constructor() {
		super();

		this.composer.command('cart', (ctx) => {
			ctx.reply('Not implemented');
		});

		this.composer.action(CartAction.AddBurgerToCart, (ctx) => {
			ctx.reply('Not implemented');
		});

		this.composer.action(CartAction.DeleteBurgerFromCart, (ctx) => {
			ctx.reply('Not implemented');
		});

		this.composer.action(CartAction.AddDrinkToCart, (ctx) => {
			ctx.reply('Not implemented');
		});

		this.composer.action(CartAction.DeleteDrinkFromCart, (ctx) => {
			ctx.reply('Not implemented');
		});
	}
}
