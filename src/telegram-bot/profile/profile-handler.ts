import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { ProfileReplyService } from './profile-reply-service';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { SceneContext } from 'telegraf/typings/scenes';

@injectable()
export class ProfileHandler extends TelegramBotHandler {
	constructor(
		@inject(DI_APP_TOKENS.ProfileReplyService) private profileReplyService: ProfileReplyService,
	) {
		super();

		this.composer.command('profile', (ctx) => {
			this.profileReplyService.showProfileCard(ctx, ctx.from.id);
		});

		this.composer.command('addAddress', (ctx) => {
			(ctx as SceneContext).scene.enter('addAddress');
		});
	}
}
