import { Context, Middleware } from 'telegraf';
import {
	TelegramBotCQSessionCtx,
	TelegramBotSessionCtx,
	TelegramBotTextSessionCtx,
} from '../telegram-bot-context.interface';
import { ITelegramBotMiddlewate } from '../telegram-bot-middleware.interface';

export interface ITelegramBotHandlerCommand {
	name: string;
	handler: (ctx: TelegramBotTextSessionCtx) => Promise<void>;
	middleware?: ITelegramBotMiddlewate;
}

export interface ITelegramBotHandlerAction {
	name: RegExp;
	handler: (ctx: TelegramBotCQSessionCtx) => Promise<void>;
	middleware?: ITelegramBotMiddlewate;
}

export interface ITelegramBotHandlerHears {
	name: RegExp;
	handler: (ctx: TelegramBotTextSessionCtx) => Promise<void>;
	middleware?: ITelegramBotMiddlewate;
}

export interface ITelegramBotHandler<C extends Context = Context> {
	middleware(): Middleware<C>;
	bindCommands?(commands: ITelegramBotHandlerCommand[]): void;
	bindActions?(actions: ITelegramBotHandlerAction[]): void;
	bindHears?(hears: ITelegramBotHandlerHears[]): void;

	setState<T extends Record<string, unknown>>(
		ctx: TelegramBotSessionCtx,
		state: T,
		path: string[],
	): void;

	getState<T extends Record<string, unknown>>(
		ctx: TelegramBotSessionCtx,
		path: string[],
	): T | undefined;
}
