import { Scenes } from 'telegraf';
import { injectable, unmanaged } from 'inversify';
import { SceneContext } from 'telegraf/typings/scenes';
import { ITelegramBotSceneHandler } from './telegram-bot-scene-handler.interface';

@injectable()
export class TelegramBotSceneHandler implements ITelegramBotSceneHandler {
	readonly scene: Scenes.BaseScene<SceneContext>;

	constructor(@unmanaged() readonly id: string) {
		this.scene = new Scenes.BaseScene<SceneContext>(id);
	}

	setState<T>(ctx: any, state: T): void {
		Object.assign(ctx.scene.session.state, state);
	}

	patchState<T>(ctx: any, parth: T): void {
		Object.assign(ctx.scene.session.state, { ...ctx.scene.session.state, ...parth });
	}

	getState<T>(ctx: any): T {
		return ctx.scene.session.state;
	}
}
