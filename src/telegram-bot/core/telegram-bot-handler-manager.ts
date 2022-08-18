import { Context, Middleware } from 'telegraf';

export interface ITelegramBotHandlerManager<C extends Context = Context> {
	middleware(): Middleware<C>;
}
