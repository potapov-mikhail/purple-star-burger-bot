import { ITgHandler, ITgContext } from '../telegram-bot.interface';

export interface ITelegramBotHandler extends ITgHandler {
	setState<T extends Record<string, unknown>>(ctx: ITgContext, state: T, path: string[]): void;
	getState<T extends Record<string, unknown>>(ctx: ITgContext, path: string[]): T | undefined;
}
