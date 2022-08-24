import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../container/tokens';
import { TGError } from '../errors/tg-error.class';
import { UserService } from '../services/user.service';
import { ProfileTemplate } from '../templates/profile-template';
import { TG_SCENES, TG_TRIGGERS } from '../telegram-bot/telegram-bot-triggers';
import { TelegramBotHandler } from '../common/telegram-bot-handler/telegram-bot-handler';

@injectable()
export class ProfileHandler extends TelegramBotHandler {
	constructor(@inject(APP_TOKENS.UserService) private userService: UserService) {
		super();

		this.composer.command(TG_TRIGGERS.Profile, async (ctx) => {
			const user = await this.userService.getUserWithAddress(ctx.from.id);

			if (!user) {
				throw new TGError('Пользователь не найден');
			}

			const template = ProfileTemplate.getProfileCard({
				user: user,
				addresses: user.address,
			});

			await ctx.replyWithMarkdown(template);
		});

		this.composer.command(TG_TRIGGERS.AddAddress, async (ctx) => {
			await ctx.scene.enter(TG_SCENES.AddAddress);
		});
	}
}
