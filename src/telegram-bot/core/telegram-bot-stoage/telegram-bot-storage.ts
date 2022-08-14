import { injectable } from 'inversify';
import { SessionContext } from 'telegraf/typings/session';
import { ITelegramBotStorage } from './telegram-bot-storage.interface';

@injectable()
export class TelegramBotStorage implements ITelegramBotStorage {
	get<T>(ctx: any): T {
		return ctx.session;
	}

	set<T>(data: unknown): T {
		throw new Error('Method not implemented.');
	}
}
