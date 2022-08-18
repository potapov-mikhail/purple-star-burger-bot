import { inject, injectable } from 'inversify';
import { plainToClass } from 'class-transformer';
import { CommonAction } from './common-actions';
import { CommonTemlate } from './common-template';
import { APP_TOKENS } from '../../common/di/tokens';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IUserService } from '../../user/user.service.interface';
import { IAddressService } from '../../address/address.service.interface';
import { TelegramBotCommandContext } from '../core/telegram-bot-context.interface';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { ProfileScene } from '../profile/profile-actions';

@injectable()
export class CommonHandler extends TelegramBotHandler {
	constructor(
		@inject(APP_TOKENS.UserService) private userService: IUserService,
		@inject(APP_TOKENS.AddressService) private addressService: IAddressService,
	) {
		super();

		this.bindCommands([
			{
				name: CommonAction.Start,
				handler: this.start.bind(this),
			},
			{
				name: CommonAction.Help,
				handler: this.help.bind(this),
			},
		]);
	}

	private async start(ctx: TelegramBotCommandContext): Promise<void> {
		let user = await this.userService.findByTgId(ctx.from.id);

		if (user) {
			await ctx.reply(CommonTemlate.getComebackGreeting(user.name));
		} else {
			const newUser = plainToClass(CreateUserDto, {
				name: ctx.from.first_name,
				tgId: ctx.from.id,
			});

			user = await this.userService.create(newUser);
			await ctx.reply(CommonTemlate.getWelcomeGreeting(user.name));
		}

		const address = await this.addressService.findAllByUserId(user.id);

		if (address.length) {
			await ctx.reply(CommonTemlate.getHelp());
		} else {
			await ctx.reply(CommonTemlate.getAddressRequest());
			await (ctx as any).scene.enter(ProfileScene.AddAddress);
		}
	}

	private async help(ctx: TelegramBotCommandContext): Promise<void> {
		ctx.reply(CommonTemlate.getHelp());
	}
}
