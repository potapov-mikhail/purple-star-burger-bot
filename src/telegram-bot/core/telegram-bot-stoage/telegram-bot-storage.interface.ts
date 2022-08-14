import { SessionContext } from 'telegraf/typings/session';

export interface ITelegramBotStorage {
	get<T>(ctx: unknown): T;
	set<T>(ctx: unknown, data: unknown): T;
}
