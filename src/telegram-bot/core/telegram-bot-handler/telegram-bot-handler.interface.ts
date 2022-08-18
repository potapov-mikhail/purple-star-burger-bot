import { Context, Middleware } from 'telegraf';
import { SessionContext } from 'telegraf/typings/session';
import { ITelegramBotMiddlewate } from '../telegram-bot-middleware.interface';

export interface ITelegramBotHandlerCommand {
	name: string;
	handler: any;
	middleware?: ITelegramBotMiddlewate;
}

export interface ITelegramBotHandlerAction {
	name: RegExp;
	handler: any;
	middleware?: ITelegramBotMiddlewate;
}

export interface ITelegramBotHandlerHears {
	name: RegExp;
	handler: any;
	middleware?: ITelegramBotMiddlewate;
}

export interface ITelegramBotHandler<C extends Context = Context> {
	middleware(): Middleware<C>;
	bindCommands?(commands: ITelegramBotHandlerCommand[]): void;
	bindActions?(actions: ITelegramBotHandlerAction[]): void;
	bindHears?(actions: ITelegramBotHandlerHears[]): void;

	setState<T extends object>(ctx: SessionContext<object>, state: T, path: string[]): void;
	getState<T extends object>(ctx: SessionContext<object>, path: string[]): T | undefined;
}
