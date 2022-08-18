import { inject, injectable } from 'inversify';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Middleware, Context, Composer, Scenes } from 'telegraf';
import { TG_BOT_TOKENS } from './di/tokens';
import { CartHandler } from './cart/cart-handler';
import { CatalogHandler } from './catalog/catalog-handler';
import { CommonHandler } from './common/common-handler';
import { ProfileHandler } from './profile/profile-handler';
import { AddAddressHandler } from './profile/address-handler';
import { ITelegramBotHandlerManager } from './core/telegram-bot-handler-manager';

@injectable()
export class TelegramBotHandlerManager implements ITelegramBotHandlerManager {
	private readonly composer = new Composer();
	private readonly stage: Scenes.Stage<SceneContext>;

	constructor(
		@inject(TG_BOT_TOKENS.CartHandler) private cartHandler: CartHandler,
		@inject(TG_BOT_TOKENS.CommonHandler) private commonHandler: CommonHandler,
		@inject(TG_BOT_TOKENS.CatalogHandler) private catalogHandler: CatalogHandler,
		@inject(TG_BOT_TOKENS.ProfileHandler) private profileHandler: ProfileHandler,
		@inject(TG_BOT_TOKENS.AddAddressHandler) private addAddressHandlerr: AddAddressHandler,
	) {
		this.stage = new Scenes.Stage<SceneContext>([this.addAddressHandlerr.scene]);
		this.composer.use(this.stage.middleware() as any);
		this.composer.use(this.commonHandler.middleware());
		this.composer.use(this.cartHandler.middleware());
		this.composer.use(this.catalogHandler.middleware());
		this.composer.use(this.profileHandler.middleware());
	}

	middleware(): Middleware<Context<Update>> {
		return this.composer;
	}
}
