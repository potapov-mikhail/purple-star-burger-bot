import { injectable } from 'inversify';
import { Composer, Context, Middleware } from 'telegraf';
import { MatchedMiddleware } from 'telegraf/typings/composer';
import { Update } from 'telegraf/typings/core/types/typegram';
import { SessionContext } from 'telegraf/typings/session';
import {
	ITelegramBotHandler,
	ITelegramBotHandlerAction,
	ITelegramBotHandlerCommand,
	ITelegramBotHandlerHears,
} from './telegram-bot-handler.interface';

@injectable()
export class TelegramBotHandler implements ITelegramBotHandler {
	readonly composer = new Composer();

	middleware(): Middleware<Context<Update>> {
		return this.composer;
	}

	bindCommands(commands: ITelegramBotHandlerCommand[]): void {
		for (const command of commands) {
			const handlers: MatchedMiddleware<Context, 'text'> = command.middleware
				? [command.middleware.execute, command.handler]
				: [command.handler];

			//@ts-ignore
			this.composer.command(command.name, ...handlers);
		}
	}

	bindActions(actions: ITelegramBotHandlerAction[]): void {
		for (const action of actions) {
			const handlers: MatchedMiddleware<Context, 'callback_query'> = action.middleware
				? [action.middleware.execute, action.handler]
				: [action.handler];

			this.composer.action(action.name, ...handlers);
		}
	}

	bindHears(hears: ITelegramBotHandlerHears[]): void {
		for (const hear of hears) {
			const handlers: MatchedMiddleware<Context, 'text'> = hear.middleware
				? [hear.middleware.execute, hear.handler]
				: [hear.handler];

			this.composer.hears(hear.name, ...handlers);
		}
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
