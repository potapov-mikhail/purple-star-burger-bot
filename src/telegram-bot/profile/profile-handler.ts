import { inject, injectable } from 'inversify';
import { TG_BOT_TOKENS } from '../di/tokens';
import { ProfileAction } from './profile-actions';
import { ProfileReplyService } from './profile-reply-service';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { TelegramBotCommandContext } from '../core/telegram-bot-context.interface';

@injectable()
export class ProfileHandler extends TelegramBotHandler {
	constructor(
		@inject(TG_BOT_TOKENS.ProfileReplyService) private profileReplyService: ProfileReplyService,
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
