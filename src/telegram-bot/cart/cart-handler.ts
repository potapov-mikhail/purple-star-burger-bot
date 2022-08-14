import { injectable } from 'inversify';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { CartAction } from './cart-actions';

@injectable()
export class CartHandler extends TelegramBotHandler {
	constructor() {
		super();

		this.composer.command('cart', (ctx) => {
			ctx.reply('Cart');
		});

		this.composer.action(CartAction.AddBurgerToCart, (ctx) => {
			ctx.reply(JSON.stringify(ctx.match));
		});

		this.composer.action(CartAction.DeleteBurgerFromCart, (ctx) => {
			ctx.reply(JSON.stringify(ctx.match));
		});

		this.composer.action(CartAction.AddDrinkToCart, (ctx) => {
			ctx.reply(JSON.stringify(ctx.match));
		});

		this.composer.action(CartAction.DeleteDrinkFromCart, (ctx) => {
			ctx.reply(JSON.stringify(ctx.match));
		});
	}
}
