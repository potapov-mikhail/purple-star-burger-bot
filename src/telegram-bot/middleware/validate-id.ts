import { Context } from 'telegraf';
import { SessionContext } from 'telegraf/typings/session';

import { parseId } from '../../utils/parse-id';
import { ITelegramBotMiddlewate } from '../core/telegram-bot-middleware.interface';
import { TelegramBotMatchedContext } from '../core/telegram-bot.interface';

export const validateId = (ctx: any, next: any) => {
	const id = parseId(ctx.match[0]);
	if (!id) {
		ctx.reply('Не корректный id');
	} else {
		next();
	}
};

type ContextWithMatch = TelegramBotMatchedContext<
	SessionContext<{}> & { match: RegExpExecArray },
	'callback_query'
>;

export class ValidateMatchId implements ITelegramBotMiddlewate<ContextWithMatch> {
	execute(ctx: ContextWithMatch, next: () => Promise<void>): void | Promise<unknown> {
		const id = parseId(ctx.match[0]);
		if (!id) {
			ctx.reply('Не корректный id');
		} else {
			next();
		}
	}
}
