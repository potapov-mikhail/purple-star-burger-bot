import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../container/tokens';
import { ILoggerService } from '../common/logger/logger.interface';
import { TGError } from './errors/tg-error.class';
import { ITgContext, ITgExceptionFilter } from './common/telegram-bot.interface';

@injectable()
export class ExceptionFilter implements ITgExceptionFilter {
	constructor(@inject(APP_TOKENS.LoggerService) private loggerService: ILoggerService) {
		this.loggerService.setPrefix(this.constructor.name);
	}

	catch(err: unknown, ctx: ITgContext): void {
		if (err instanceof TGError) {
			this.loggerService.error(err.message);
			ctx.reply(err.message);
		} else {
			const unknownMessage = (err as Error)?.message ?? 'Catch unknown error';
			this.loggerService.error(unknownMessage);
			ctx.reply('☹️ Упс! Что то пошло не так');
		}
	}
}
