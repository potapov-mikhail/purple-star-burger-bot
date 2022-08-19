import { inject, injectable } from 'inversify';
import { CORE_TOKENS } from '../core/di/tokens';
import { ILoggerService } from '../core/logger/logger.interface';
import { ITelegramBotGlobalErrorHandler } from './core/telegram-bot-global-error-handler';

@injectable()
export class TelegramBotGlobalErrorHandler implements ITelegramBotGlobalErrorHandler {
	constructor(@inject(CORE_TOKENS.LoggerService) private readonly loggerService: ILoggerService) {
		this.loggerService.setPrefix(this.constructor.name);
	}

	async handleError(error: unknown): Promise<void> {
		this.loggerService.error(error);
	}
}
