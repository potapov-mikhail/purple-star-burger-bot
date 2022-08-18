import { injectable } from 'inversify';
import { ITelegramBotGlobalErrorHandler } from './core/telegram-bot-global-error-handler';

@injectable()
export class TelegramBotGlobalErrorHandler implements ITelegramBotGlobalErrorHandler {
	handleError(error: unknown): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
