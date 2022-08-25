import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { IApplication } from './app.interface';
import { APP_TOKENS } from '../container/tokens';
import { ILoggerService } from '../common/logger/logger.interface';
import { IPrismaService } from '../common/database/prisma.interface';
import { ITelegramBot } from '../telegram-bot/common/telegram-bot.interface';

@injectable()
export class Application implements IApplication {
	constructor(
		@inject(APP_TOKENS.TelegramBot) private readonly telegramBot: ITelegramBot,
		@inject(APP_TOKENS.LoggerService) private readonly loggerService: ILoggerService,
		@inject(APP_TOKENS.PrismaService) private readonly prismaService: IPrismaService,
	) {
		this.loggerService.setPrefix(this.constructor.name);
	}

	async init(): Promise<void> {
		await this.prismaService.connect();
		await this.telegramBot.run();
		this.loggerService.log('Successfully run');
	}

	async close(): Promise<void> {
		await this.telegramBot.stop();
		await this.prismaService.disconnect();
		this.loggerService.log('Successfully shut down');
	}
}
