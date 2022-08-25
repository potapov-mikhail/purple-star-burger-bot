import { inject, injectable } from 'inversify';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Middleware, Context, Composer, Scenes } from 'telegraf';
import { APP_TOKENS } from '../container/tokens';
import { CommonHandler } from './handlers/common-handler';
import { CatalogHandler } from './handlers/catalog-handler';
import { ProfileHandler } from './handlers/profile-handler';
import { AddAddressScene } from './scenes/add-address-scene';
import { ITgContext, ITgHandler } from './common/telegram-bot.interface';

@injectable()
export class TelegramBotHandlerManager implements ITgHandler {
	private readonly stage: Scenes.Stage<ITgContext>;
	private readonly composer = new Composer<ITgContext>();

	constructor(
		@inject(APP_TOKENS.CommonHandler) private commonHandler: CommonHandler,
		@inject(APP_TOKENS.CatalogHandler) private catalogHandler: CatalogHandler,
		@inject(APP_TOKENS.ProfileHandler) private profileHandler: ProfileHandler,
		@inject(APP_TOKENS.AddAddressScene) private addAddressScene: AddAddressScene,
	) {
		this.stage = new Scenes.Stage<ITgContext>([this.addAddressScene.scene]);
		this.composer.use(this.stage.middleware());
		this.composer.use(this.commonHandler.middleware());
		this.composer.use(this.catalogHandler.middleware());
		this.composer.use(this.profileHandler.middleware());
	}

	middleware(): Middleware<Context<Update> & ITgContext> {
		return this.composer;
	}
}
