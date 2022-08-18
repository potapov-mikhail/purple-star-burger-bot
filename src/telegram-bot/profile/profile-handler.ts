import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { ProfileReplyService } from './profile-reply-service';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { ProfileAction } from './profile-actions';
import { TelegramBotCommandContext } from '../core/telegram-bot-context.interface';

@injectable()
export class ProfileHandler extends TelegramBotHandler {
	constructor(
		@inject(DI_APP_TOKENS.ProfileReplyService) private profileReplyService: ProfileReplyService,
	) {
		super();

		this.bindCommands([
			{
				name: ProfileAction.Profile,
				handler: this.showProfileCard.bind(this),
			},

			{
				name: ProfileAction.AddAddress,
				handler: this.addAddress.bind(this),
			},
		]);
	}

	private async showProfileCard(ctx: TelegramBotCommandContext): Promise<void> {
		this.profileReplyService.showProfileCard(ctx, ctx.from.id);
	}

	private async addAddress(ctx: TelegramBotCommandContext): Promise<void> {
		(ctx as any).scene.enter('addAddress');
	}
}
