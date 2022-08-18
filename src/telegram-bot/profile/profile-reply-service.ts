import { Context } from 'telegraf';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../common/di/tokens';
import { ProfileTemplate } from './profile-template';
import { IUserService } from '../../user/user.service.interface';
import { IAddressService } from '../../address/address.service.interface';

@injectable()
export class ProfileReplyService {
	constructor(
		@inject(APP_TOKENS.UserService) private userService: IUserService,
		@inject(APP_TOKENS.AddressService) private addressService: IAddressService,
	) {}

	async showProfileCard(ctx: Context, tgId: number): Promise<void> {
		const user = await this.userService.findByTgId(tgId);

		if (!user) {
			return;
		}

		const addresses = await this.addressService.findAllByUserId(user.id);
		const template = ProfileTemplate.getProfileCard({ user, addresses });
		ctx.reply(template);
	}
}
