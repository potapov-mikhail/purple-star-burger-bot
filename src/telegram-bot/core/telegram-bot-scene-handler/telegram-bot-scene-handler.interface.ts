import { Scenes } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export interface ITelegramBotSceneHandler {
	readonly scene: Scenes.BaseScene<SceneContext>;

	setState<T extends Record<string, unknown>>(ctx: any, state: T): void;
	getState<T extends Record<string, unknown>>(ctx: any): T;
}
