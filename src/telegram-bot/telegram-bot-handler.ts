import { injectable } from 'inversify';
import { Middleware, Context, Composer } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ITelegramBotHandler } from './telegram-bot-handler.interface';

@injectable()
export class TelegramBotHandler implements ITelegramBotHandler {
	private readonly composer = new Composer();

	constructor() {
		this.composer.command('start', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('help', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('burgers', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('drinks', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('cart', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('profile', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});

		this.composer.command('orders', (ctx) => {
			ctx.reply(`Handle ${ctx.message.text} command`);
		});
	}

	middleware(): Middleware<Context<Update>> {
		return this.composer;
	}
}
