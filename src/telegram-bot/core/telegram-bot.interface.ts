import { Context, NarrowedContext } from 'telegraf';
import { MessageSubType, MountMap, UpdateType } from 'telegraf/typings/telegram-types';

export interface ITelegramBot {
	run(): Promise<void>;
	stop(): void;
}
