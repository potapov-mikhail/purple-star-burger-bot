import { injectable } from 'inversify';
import { Composer, Context, Middleware } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { SessionContext } from 'telegraf/typings/session';
import { ITelegramBotHandler } from './telegram-bot-handler.interface';

@injectable()
export class TelegramBotHandler implements ITelegramBotHandler {
	readonly composer = new Composer();

	middleware(): Middleware<Context<Update>> {
		return this.composer;
	}

	setState<T extends object>(ctx: SessionContext<object>, state: T, path: string[] = []): void {
		if (typeof ctx.session !== 'object') {
			ctx.session = {};
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

	getState<T extends object>(ctx: SessionContext<object>, path: string[] = []): T | undefined {
		const keys = path.concat();
		let key = keys.shift();
		let state = ctx.session;

		while (typeof state === 'object' && key) {
			state = (state as any)[key];
			key = keys.shift();
		}

		return state as T;
	}
}
