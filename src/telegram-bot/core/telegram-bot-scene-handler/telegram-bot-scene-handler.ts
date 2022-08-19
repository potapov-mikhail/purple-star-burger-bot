import { injectable, unmanaged } from 'inversify';
import { Markup, Middleware, Scenes } from 'telegraf';
import { ITelegramBotSceneHandler } from './telegram-bot-scene-handler.interface';
import { ITelegramBotMiddlewate } from '../telegram-bot-middleware.interface';
import { TelegramBotScentCtx, TelegramBotTextSceneCtx } from '../telegram-bot-context.interface';

export interface ITelegramBotSceneHandlerHears {
	name: RegExp | string;
	handler: (ctx: TelegramBotTextSceneCtx) => Promise<void>;
	middleware?: ITelegramBotMiddlewate<TelegramBotTextSceneCtx>;
}

@injectable()
export class TelegramBotSceneHandler implements ITelegramBotSceneHandler {
	readonly scene: Scenes.BaseScene<TelegramBotScentCtx>;

	constructor(@unmanaged() readonly id: string) {
		this.scene = new Scenes.BaseScene<TelegramBotScentCtx>(id);
	}

	setState<T>(ctx: TelegramBotScentCtx, state: T): void {
		if (typeof ctx.scene.session.state !== 'object') {
			ctx.scene.session.state = {};
		}

		Object.assign(ctx.scene.session.state, state);
	}

	patchState<T>(ctx: TelegramBotScentCtx, parth: T): void {
		if (typeof ctx.scene.session.state !== 'object') {
			ctx.scene.session.state = {};
		}

		Object.assign(ctx.scene.session.state, { ...ctx.scene.session.state, ...parth });
	}

	getState<T>(ctx: TelegramBotScentCtx): T | undefined {
		return ctx.scene.session.state as unknown as T;
	}

	bindHears(hears: ITelegramBotSceneHandlerHears[]): void {
		for (const hear of hears) {
			if (!hear.middleware) {
				this.scene.hears(hear.name, hear.handler);
			} else {
				this.scene.hears(hear.name, hear.middleware.execute, hear.handler);
			}
		}
	}

	bindEnterHanders(...handlers: Array<Middleware<TelegramBotScentCtx>>): void {
		this.scene.enter(...handlers);
	}

	bindTextHander(handler: Middleware<TelegramBotTextSceneCtx>): void {
		this.scene.on('text', handler);
	}

	async removeKeyBoard<C extends TelegramBotScentCtx>(ctx: C, text: string): Promise<void> {
		await ctx.reply(text, Markup.removeKeyboard());
	}

	async leave<C extends TelegramBotScentCtx>(ctx: C): Promise<void> {
		await ctx.scene.leave();
	}
}
