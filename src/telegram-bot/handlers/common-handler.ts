import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { UserEntity } from '../../domains/user/user.entity';
import { UserService } from '../../domains/user/user.service';
import { CommonTemplate } from '../templates/common-template';
import { TG_TRIGGERS } from '../telegram-bot-triggers';
import { TelegramBotHandler } from '../common/telegram-bot-handler/telegram-bot-handler';

@injectable()
export class CommonHandler extends TelegramBotHandler {
	constructor(@inject(APP_TOKENS.UserService) private userService: UserService) {
		super();

		this.composer.command(TG_TRIGGERS.Start, async (ctx) => {
			const userWithAddress = await this.userService.getUserWithAddress(ctx.from.id);

			if (!userWithAddress) {
				const user = new UserEntity({
					tgId: ctx.from.id,
					name: ctx.from.first_name,
				});

				const createdUser = await this.userService.createUser(user);
				await ctx.reply(CommonTemplate.getWelcomeGreeting(createdUser.name));
				await ctx.scene.enter(TG_TRIGGERS.AddAddress);
				return;
			}

			await ctx.reply(CommonTemplate.getComebackGreeting(userWithAddress.name));

			if (!userWithAddress.address.length) {
				await ctx.scene.enter(TG_TRIGGERS.AddAddress);
				return;
			}
		});
	}
}
