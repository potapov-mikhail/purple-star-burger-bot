import { Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ITelegramBotSceneHandlerHears } from './telegram-bot-scene-handler';

export interface ITelegramBotSceneHandler {
	readonly scene: Scenes.BaseScene<SceneContext>;
	setState<T extends Record<string, unknown>>(ctx: any, state: T): void;
	patchState<T extends Record<string, unknown>>(ctx: any, state: T): void;
	getState<T extends Record<string, unknown>>(ctx: any): T;
	bindHears(hears: ITelegramBotSceneHandlerHears[]): void;
	bindEnterHander(handler: any): void;
	bindTextHander(handler: any): void;
}
