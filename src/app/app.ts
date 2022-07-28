import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DI_TOKENS } from '../core/di/tokens';
import { IApplication } from './app.interface';
import { IPrismaService } from '../core/database/prisma.interface';
import { ILoggerService } from '../core/logger/logger.interface';
import { ITelegramBot } from '../telegram-bot/telegram-bot.interface';

@injectable()
export class Application implements IApplication {
	constructor(
		@inject(DI_TOKENS.TelegramBot) private readonly telegramBot: ITelegramBot,
		@inject(DI_TOKENS.LoggerService) private readonly loggerService: ILoggerService,
		@inject(DI_TOKENS.PrismaService) private readonly prismaService: IPrismaService,
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
