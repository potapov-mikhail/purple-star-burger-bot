import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { IAddressService } from '../address/address.service.interface';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IUserService } from '../user/user.service.interface';
import { ProfileReplyView } from './profile-reply-view';

@injectable()
export class ProfileTelegramBotController {
	constructor(
		@inject(DI_APP_TOKENS.UserService) private userService: IUserService,
		@inject(DI_APP_TOKENS.AddressService) private addressService: IAddressService,
	) {}

	async showAddressList(ctx: Context, id: number): Promise<void> {
		const user = await this.userService.findByTgId(id);
		const addresses = await this.addressService.findAllByUserId(user!.id);
		const template = ProfileReplyView.getProfileCard(user!, addresses);
		await ctx.replyWithMarkdown(template);
	}
}
