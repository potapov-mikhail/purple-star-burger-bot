import { injectable } from 'inversify';
import { Composer, Context, Middleware } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ITgHandler, ITgContext } from '../telegram-bot.interface';

@injectable()
export class TelegramBotHandler implements ITgHandler {
	readonly composer = new Composer<ITgContext>();

	middleware(): Middleware<Context<Update> & ITgContext> {
		return this.composer;
	}

	setState<T extends Record<string, unknown>>(
		ctx: ITgContext,
		state: T,
		path: string[] = [],
	): void {
		if (typeof ctx.session !== 'object') {
			ctx.session = {} as any;
		}

		let current = ctx.session as any;

		path.forEach((key) => {
			if (typeof current[key] !== 'object') {
				current[key] = {};
			}

			current = current[key];
		});

		Object.assign(current, state);
	}

	getState<T extends Record<string, unknown>>(ctx: ITgContext, path: string[] = []): T | undefined {
		const keys = path.concat();
		let key = keys.shift();
		let state = ctx.session as any;

		while (typeof state === 'object' && key) {
			state = state[key];
			key = keys.shift();
		}

		return state as T;
	}
}
