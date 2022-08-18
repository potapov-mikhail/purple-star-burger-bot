import { Context } from 'telegraf';

export interface ITelegramBotMiddlewate<C extends Context = Context> {
	execute(ctx: C, next: () => Promise<void>): Promise<unknown> | void;
}
