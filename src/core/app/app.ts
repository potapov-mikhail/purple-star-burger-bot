import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DI_TOKENS } from '../di/tokens';
import { IApplication } from '../app/app.interface';
import { IConfigService } from '../config/config.interface';
import { IPrismaService } from '../database/prisma.interface';
import { ILoggerService } from '../logger/logger.interface';
import { ITelegramBot } from '../../tg-bot/telegram-bot.interface';

@injectable()
export class Application implements IApplication {
	constructor(
		@inject(DI_TOKENS.TelegramBot) private readonly telegramBot: ITelegramBot,
		@inject(DI_TOKENS.LoggerService) private readonly loggerService: ILoggerService,
		@inject(DI_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(DI_TOKENS.PrismaService) private readonly prismaService: IPrismaService,
	) {}

	async init(): Promise<void> {
		await this.prismaService.connect();
		await this.telegramBot.run();
		this.loggerService.log('[Application] Successfully run');
	}

	async close(): Promise<void> {
		await this.telegramBot.stop();
		await this.prismaService.disconnect();
		this.loggerService.log('[Application] Successfully shut down');
	}
}
