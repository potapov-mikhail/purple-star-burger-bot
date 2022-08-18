import { ContainerModule, interfaces } from 'inversify';
import { TG_BOT_TOKENS } from './tokens';
import { TelegramBot } from '../telegram-bot';
import { CartHandler } from '../cart/cart-handler';
import { CommonHandler } from '../common/common-handler';
import { ProfileHandler } from '../profile/profile-handler';
import { CatalogHandler } from '../catalog/catalog-handler';
import { ITelegramBot } from '../core/telegram-bot.interface';
import { AddAddressHandler } from '../profile/address-handler';
import { ProfileReplyService } from '../profile/profile-reply-service';
import { CatalogReplyService } from '../catalog/catalog-reply-service';
import { TelegramBotHandlerManager } from '../telegram-bot-handler-manager';
import { ITelegramBotHandlerManager } from '../core/telegram-bot-handler-manager';
import { TelegramBotGlobalErrorHandler } from '../telegram-bot-global-error-handler';
import { ITelegramBotGlobalErrorHandler } from '../core/telegram-bot-global-error-handler';
import { ITelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler.interface';

export const DI_TG_BOT_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<ITelegramBot>(TG_BOT_TOKENS.TelegramBot).to(TelegramBot);
	bind<ITelegramBotHandlerManager>(TG_BOT_TOKENS.TelegramBotHandlerManager).to(
		TelegramBotHandlerManager,
	);
	bind<ITelegramBotGlobalErrorHandler>(TG_BOT_TOKENS.TelegramBotGlobalErrorHandler).to(
		TelegramBotGlobalErrorHandler,
	);

	bind<ITelegramBotHandler>(TG_BOT_TOKENS.CartHandler).to(CartHandler).inSingletonScope();
	bind<ITelegramBotHandler>(TG_BOT_TOKENS.CatalogHandler).to(CatalogHandler).inSingletonScope();
	bind<ITelegramBotHandler>(TG_BOT_TOKENS.CommonHandler).to(CommonHandler).inSingletonScope();
	bind<ITelegramBotHandler>(TG_BOT_TOKENS.ProfileHandler).to(ProfileHandler).inSingletonScope();

	bind<AddAddressHandler>(TG_BOT_TOKENS.AddAddressHandler).to(AddAddressHandler).inSingletonScope();
	bind<ProfileReplyService>(TG_BOT_TOKENS.ProfileReplyService).to(ProfileReplyService);
	bind<CatalogReplyService>(TG_BOT_TOKENS.CatalogReplyService)
		.to(CatalogReplyService)
		.inSingletonScope();
});
