import { ContainerModule, interfaces } from 'inversify';
import { APP_TOKENS } from './tokens';
import { Application } from '../app/app';
import { IApplication } from '../app/app.interface';
import { UserService } from '../domains/user/user.service';
import { TelegramBot } from '../telegram-bot/telegram-bot';
import { DaDataService } from '../domains/dadata/dadata.service';
import { CommonHandler } from '../telegram-bot/handlers/common-handler';
import { AddAddressScene } from '../telegram-bot/scenes/add-address-scene';
import { ExceptionFilter } from '../telegram-bot/telegram-bot-exception-filter';
import { CatalogHandler } from '../telegram-bot/handlers/catalog-handler';
import { ProfileHandler } from '../telegram-bot/handlers/profile-handler';
import { ProductService } from '../domains/product/product.service';
import { ConfigService } from '../common/config/config.service';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../common/database/prisma.service';
import { ILoggerService } from '../common/logger/logger.interface';
import { IConfigService } from '../common/config/config.interface';
import { IPrismaService } from '../common/database/prisma.interface';
import { TelegramBotHandlerManager } from '../telegram-bot/telegram-bot-handler-manager';
import { ITelegramBotHandler } from '../telegram-bot/common/telegram-bot-handler/telegram-bot-handler.interface';
import {
	IHandlerManager,
	ITelegramBot,
	ITgExceptionFilter,
} from '../telegram-bot/common/telegram-bot.interface';

export const DI_APP_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<IApplication>(APP_TOKENS.Application).to(Application);
	bind<ILoggerService>(APP_TOKENS.LoggerService).to(LoggerService);
	bind<IConfigService>(APP_TOKENS.ConfigService).to(ConfigService).inSingletonScope();
	bind<IPrismaService>(APP_TOKENS.PrismaService).to(PrismaService).inSingletonScope();
	bind<UserService>(APP_TOKENS.UserService).to(UserService).inSingletonScope();
	bind<DaDataService>(APP_TOKENS.DaDataService).to(DaDataService).inSingletonScope();
	bind<ProductService>(APP_TOKENS.ProductService).to(ProductService).inSingletonScope();
	bind<ITelegramBot>(APP_TOKENS.TelegramBot).to(TelegramBot).inSingletonScope();
	bind<IHandlerManager>(APP_TOKENS.HandlerManager).to(TelegramBotHandlerManager).inSingletonScope();
	bind<ITelegramBotHandler>(APP_TOKENS.CatalogHandler).to(CatalogHandler).inSingletonScope();
	bind<ITelegramBotHandler>(APP_TOKENS.CommonHandler).to(CommonHandler).inSingletonScope();
	bind<ITelegramBotHandler>(APP_TOKENS.ProfileHandler).to(ProfileHandler).inSingletonScope();
	bind<AddAddressScene>(APP_TOKENS.AddAddressScene).to(AddAddressScene).inSingletonScope();
	bind<ITgExceptionFilter>(APP_TOKENS.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
});
