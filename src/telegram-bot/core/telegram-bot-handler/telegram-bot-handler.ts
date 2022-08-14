import { injectable } from 'inversify';
import { Composer, Context, Middleware } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ITelegramBotHandler } from './telegram-bot-handler.interface';

@injectable()
export class TelegramBotHandler implements ITelegramBotHandler {
	readonly composer = new Composer();

	middleware(): Middleware<Context<Update>> {
		return this.composer;
	}
}
