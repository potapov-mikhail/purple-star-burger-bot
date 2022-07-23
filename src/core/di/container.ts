import { ContainerModule, interfaces } from 'inversify';
import { DI_TOKENS } from '../di/tokens';
import { IApplication } from '../app/app.interface';
import { Application } from '../app/app';
import { LoggerService } from '../logger/logger.service';
import { ILoggerService } from '../logger/logger.interface';
import { ConfigService } from '../config/config.service';
import { IConfigService } from '../config/config.interface';
import { PrismaService } from '../database/prisma.service';
import { IPrismaService } from '../database/prisma.interface';
import { ITelegramBot } from '../../tg-bot/telegram-bot.interface';
import { TelegramBot } from '../../tg-bot/tg.bot';

export const DI_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<IApplication>(DI_TOKENS.Application).to(Application);
	bind<ITelegramBot>(DI_TOKENS.TelegramBot).to(TelegramBot);
	bind<ILoggerService>(DI_TOKENS.LoggerService).to(LoggerService).inSingletonScope();
	bind<IConfigService>(DI_TOKENS.ConfigService).to(ConfigService).inSingletonScope();
	bind<IPrismaService>(DI_TOKENS.PrismaService).to(PrismaService).inSingletonScope();
});
