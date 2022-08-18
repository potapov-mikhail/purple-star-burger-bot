import { inject, injectable } from 'inversify';
import { CommonAction } from './common-actions';
import { CommonTemlate } from './common-template';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IUserService } from '../../user/user.service.interface';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { plainToClass } from 'class-transformer';

@injectable()
export class CommonHandler extends TelegramBotHandler {
	constructor(@inject(DI_APP_TOKENS.UserService) private userService: IUserService) {
		super();

		this.composer.command(CommonAction.start, async (ctx) => {
			const foundUser = await this.userService.findByTgId(ctx.from.id);

			if (foundUser) {
				ctx.reply(CommonTemlate.getComebackGreeting(foundUser.name));
			} else {
				const dto = plainToClass(CreateUserDto, { name: ctx.from.first_name, tgId: ctx.from.id });
				const createdUser = await this.userService.create(dto);
				ctx.reply(CommonTemlate.getWelcomeGreeting(createdUser.name));
			}
		});

		this.composer.command(CommonAction.help, (ctx) => {
			ctx.reply(CommonTemlate.getHelp());
		});
	}
}
