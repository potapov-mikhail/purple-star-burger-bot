import { injectable } from 'inversify';
import { Composer, Context, Middleware } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { TelegramBotSessionCtx } from '../telegram-bot-context.interface';
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
			if (!command.middleware) {
				this.composer.command(command.name, command.handler);
			} else {
				this.composer.command(command.name, command.middleware.execute, command.handler);
			}
		}
	}

	bindActions(actions: ITelegramBotHandlerAction[]): void {
		for (const action of actions) {
			if (!action.middleware) {
				this.composer.action(action.name, action.handler);
			} else {
				this.composer.action(action.name, action.middleware.execute, action.handler);
			}
		}
	}

	bindHears(hears: ITelegramBotHandlerHears[]): void {
		for (const hear of hears) {
			if (!hear.middleware) {
				this.composer.hears(hear.name, hear.handler);
			} else {
				this.composer.hears(hear.name, hear.middleware.execute, hear.handler);
			}
		}
	}

	setState<T extends Record<string, unknown>>(
		ctx: TelegramBotSessionCtx,
		state: T,
		path: string[] = [],
	): void {
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

	getState<T extends Record<string, unknown>>(
		ctx: TelegramBotSessionCtx,
		path: string[] = [],
	): T | undefined {
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
