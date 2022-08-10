import { DI_TOKENS } from '../core/di/tokens';
import { inject, injectable } from 'inversify';
import { ITelegramBot } from './telegram-bot.interface';
import { IConfigService } from '../core/config/config.interface';
import { Telegraf } from 'telegraf';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IUserService } from '../user/user.service.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';

@injectable()
export class TelegramBot implements ITelegramBot {
	private readonly telegraf: Telegraf;

	constructor(
		@inject(DI_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(DI_APP_TOKENS.UserService) private readonly userService: IUserService,
	) {
		const token = this.configService.get('TG_BOT_TOKEN');

		if (!token) {
			throw new Error('TG_BOT_TOKEN is not defined');
		}

		this.telegraf = new Telegraf(token);

		this.telegraf.start(async (ctx) => {
			const user = await this.userService.findByTgId(ctx.from.id);

			if (!user) {
				const dto = new CreateUserDto(ctx.from.first_name, ctx.from.id);
				const createdUser = await this.userService.create(dto);

				await ctx.reply(`Welcome ${createdUser.name}!`);
			} else {
				await ctx.reply(`Welcome back ${user.name}!`);
			}
		});
	}

	run(): Promise<void> {
		return this.telegraf.launch();
	}

	stop(): void {
		this.telegraf.stop();
	}
}
