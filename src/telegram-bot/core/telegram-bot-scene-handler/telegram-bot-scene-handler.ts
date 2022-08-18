import { Context, Scenes } from 'telegraf';
import { injectable, unmanaged } from 'inversify';
import { SceneContext } from 'telegraf/typings/scenes';
import { ITelegramBotSceneHandler } from './telegram-bot-scene-handler.interface';
import { ITelegramBotMiddlewate } from '../telegram-bot-middleware.interface';
import { MatchedMiddleware } from 'telegraf/typings/composer';

export interface ITelegramBotSceneHandlerHears {
	name: RegExp | string;
	handler: any;
	middleware?: ITelegramBotMiddlewate;
}

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

	bindHears(hears: ITelegramBotSceneHandlerHears[]): void {
		for (const hear of hears) {
			const handlers: MatchedMiddleware<Context, 'text'> = hear.middleware
				? [hear.middleware.execute, hear.handler]
				: [hear.handler];

			this.scene.hears(hear.name, ...handlers);
		}
	}

	bindEnterHander(handler: any): void {
		this.scene.enter(handler);
	}

	bindTextHander(handler: any): void {
		this.scene.on('text', handler);
	}
}
