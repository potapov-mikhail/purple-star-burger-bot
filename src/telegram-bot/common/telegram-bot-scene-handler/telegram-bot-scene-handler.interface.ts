import { Scenes } from 'telegraf';
import { ITgContext } from '../telegram-bot.interface';

export interface ITelegramBotSceneHandler {
	readonly scene: Scenes.BaseScene<ITgContext>;
	setState<T extends Record<string, unknown>>(ctx: ITgContext, state: T): void;
	patchState<T extends Record<string, unknown>>(ctx: ITgContext, state: T): void;
	getState<T extends Record<string, unknown>>(ctx: ITgContext): T | undefined;
	leaveAndRemove(ctx: ITgContext, text: string): Promise<void>;
}
