import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../container/tokens';
import { ILoggerService } from '../common/logger/logger.interface';
import { ITgContext } from '../common/telegram-bot.interface';
import { IExceptionFilter } from './exception.filter.interface';
import { TGError } from './tg-error.class';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
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
			ctx.reply('Упс! Что то пошло не так');
		}
	}
}
