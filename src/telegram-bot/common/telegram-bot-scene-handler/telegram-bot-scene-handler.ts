import { Markup, Scenes } from 'telegraf';
import { injectable, unmanaged } from 'inversify';
import { ITgContext } from '../telegram-bot.interface';
import { ITelegramBotSceneHandler } from './telegram-bot-scene-handler.interface';

@injectable()
export class TelegramBotSceneHandler implements ITelegramBotSceneHandler {
	readonly scene: Scenes.BaseScene<ITgContext>;

	constructor(@unmanaged() readonly id: string) {
		this.scene = new Scenes.BaseScene<ITgContext>(id);
	}

	setState<T>(ctx: ITgContext, state: T): void {
		if (typeof ctx.scene.session.state !== 'object') {
			ctx.scene.session.state = {};
		}

		Object.assign(ctx.scene.session.state, state);
	}

	patchState<T>(ctx: ITgContext, part: Partial<T>): void {
		if (typeof ctx.scene.session.state !== 'object') {
			ctx.scene.session.state = {};
		}

		Object.assign(ctx.scene.session.state, { ...ctx.scene.session.state, ...part });
	}

	getState<T>(ctx: ITgContext): T | undefined {
		return ctx.scene.session.state as unknown as T;
	}

	async leaveAndRemove(ctx: any, text: string): Promise<void> {
		await ctx.reply(text, Markup.removeKeyboard());
		await ctx.scene.leave();
	}
}
