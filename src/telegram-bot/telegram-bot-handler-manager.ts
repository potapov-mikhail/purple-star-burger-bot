import { inject, injectable } from 'inversify';
import { Middleware, Context, Composer, Scenes } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { CartHandler } from './cart/cart-handler';
import { CatalogHandler } from './catalog/catalog-handler';
import { CommonHandler } from './common/common-handler';
import { ProfileHandler } from './profile/profile-handler';
import { ITelegramBotHandler } from './core/telegram-bot-handler/telegram-bot-handler.interface';
import { AddAddressHandler } from './profile/address-handler';

@injectable()
export class TelegramBotHandlerManager implements ITelegramBotHandler {
	private readonly composer = new Composer();
	private readonly stage: Scenes.Stage<SceneContext>;

	constructor(
		@inject(DI_APP_TOKENS.CartHandler) private cartHandler: CartHandler,
		@inject(DI_APP_TOKENS.CommandHandler) private commandHandler: CommonHandler,
		@inject(DI_APP_TOKENS.CatalogHandler) private catalogHandler: CatalogHandler,
		@inject(DI_APP_TOKENS.ProfileHandler) private profileHandler: ProfileHandler,
		@inject(DI_APP_TOKENS.AddAddressHandler) private addAddressHandlerr: AddAddressHandler,
	) {
		this.stage = new Scenes.Stage<SceneContext>([this.addAddressHandlerr.scene]);
		this.composer.use(this.stage.middleware() as any);
		this.composer.use(this.commandHandler.middleware());
		this.composer.use(this.cartHandler.middleware());
		this.composer.use(this.catalogHandler.middleware());
		this.composer.use(this.profileHandler.middleware());
	}

	middleware(): Middleware<Context<Update>> {
		return this.composer;
	}
}
