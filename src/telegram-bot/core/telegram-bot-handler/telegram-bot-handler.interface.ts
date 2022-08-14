import { Context, Middleware } from 'telegraf';

export interface ITelegramBotHandler<C extends Context = Context> {
	middleware(): Middleware<C>;
}
