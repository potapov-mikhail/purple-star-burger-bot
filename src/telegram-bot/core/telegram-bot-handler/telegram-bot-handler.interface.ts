import { Context, Middleware } from 'telegraf';
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
}
