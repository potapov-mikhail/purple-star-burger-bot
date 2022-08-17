import { ContainerModule, interfaces } from 'inversify';
import { CartHandler } from '../cart/cart-handler';
import { CatalogHandler } from '../catalog/catalog-handler';
import { CatalogReplyService } from '../catalog/catalog-reply-service';
import { CommonHandler } from '../common/common-handler';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { ProfileHandler } from '../profile/profile-handler';
import { DI_TG_TOKENS } from './tokens';

export const DI_TG_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<TelegramBotHandler>(DI_TG_TOKENS.CartHandler).to(CartHandler).inSingletonScope();

	bind<TelegramBotHandler>(DI_TG_TOKENS.CatalogHandler).to(CatalogHandler).inSingletonScope();
	bind<CatalogReplyService>(DI_TG_TOKENS.CatalogReplyService)
		.to(CatalogReplyService)
		.inSingletonScope();

	bind<TelegramBotHandler>(DI_TG_TOKENS.CommonHandler).to(CommonHandler).inSingletonScope();
	bind<TelegramBotHandler>(DI_TG_TOKENS.ProfileHandler).to(ProfileHandler).inSingletonScope();
});
