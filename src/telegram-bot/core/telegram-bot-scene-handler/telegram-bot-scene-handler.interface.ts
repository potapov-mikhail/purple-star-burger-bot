import { Middleware, Scenes } from 'telegraf';
import { TelegramBotScentCtx, TelegramBotTextSceneCtx } from '../telegram-bot-context.interface';
import { ITelegramBotSceneHandlerHears } from './telegram-bot-scene-handler';

export interface ITelegramBotSceneHandler {
	readonly scene: Scenes.BaseScene<TelegramBotScentCtx>;
	setState<T extends Record<string, unknown>>(ctx: TelegramBotScentCtx, state: T): void;
	patchState<T extends Record<string, unknown>>(ctx: TelegramBotScentCtx, state: T): void;
	getState<T extends Record<string, unknown>>(ctx: TelegramBotScentCtx): T | undefined;

	bindHears(hears: ITelegramBotSceneHandlerHears[]): void;
	bindTextHander(handler: Middleware<TelegramBotTextSceneCtx>): void;
	bindEnterHanders(...handlers: Array<Middleware<TelegramBotScentCtx>>): void;
}
