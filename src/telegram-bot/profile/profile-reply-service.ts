import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { IAddressService } from '../../address/address.service.interface';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { IUserService } from '../../user/user.service.interface';
import { ProfileTemplate } from './profile-template';

@injectable()
export class ProfileReplyService {
	constructor(
		@inject(DI_APP_TOKENS.UserService) private userService: IUserService,
		@inject(DI_APP_TOKENS.AddressService) private addressService: IAddressService,
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
