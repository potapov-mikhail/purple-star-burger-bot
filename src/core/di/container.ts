import { ContainerModule, interfaces } from 'inversify';
import { CORE_TOKENS } from '../di/tokens';
import { LoggerService } from '../logger/logger.service';
import { ILoggerService } from '../logger/logger.interface';
import { ConfigService } from '../config/config.service';
import { IConfigService } from '../config/config.interface';
import { PrismaService } from '../database/prisma.service';
import { IPrismaService } from '../database/prisma.interface';

export const DI_CORE_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerService>(CORE_TOKENS.LoggerService).to(LoggerService);
	bind<IConfigService>(CORE_TOKENS.ConfigService).to(ConfigService).inSingletonScope();
	bind<IPrismaService>(CORE_TOKENS.PrismaService).to(PrismaService).inSingletonScope();
});
