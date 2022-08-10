import { DI_TOKENS } from '../core/di/tokens';
import { inject, injectable } from 'inversify';
import { ITelegramBot } from './telegram-bot.interface';
import { IConfigService } from '../core/config/config.interface';
import { Telegraf } from 'telegraf';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IUserService } from '../user/user.service.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IProductService } from '../product/product.service.interface';
import { IAddressService } from '../address/address.service.interface';
import { IOrderService } from '../order/order.service.interface';

@injectable()
export class TelegramBot implements ITelegramBot {
	private readonly telegraf: Telegraf;

	constructor(
		@inject(DI_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(DI_APP_TOKENS.UserService) private readonly userService: IUserService,
		@inject(DI_APP_TOKENS.ProductService) private readonly productService: IProductService,
		@inject(DI_APP_TOKENS.AddressService) private readonly addressService: IAddressService,
		@inject(DI_APP_TOKENS.OrderService) private readonly orderService: IOrderService,
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

			const burgers = await this.productService.findAllBurgers();
			await ctx.reply(`Our burgers: \n ${burgers.map((b) => b.name).join('\n')}!`);
			const drinks = await this.productService.findAllDrinks();
			await ctx.reply(`Our drinks: \n ${drinks.map((b) => b.name).join('\n')}!`);

			this.orderService.findAllByUserId(4).then(console.log);
		});
	}

	run(): Promise<void> {
		return this.telegraf.launch();
	}

	stop(): void {
		this.telegraf.stop();
	}
}
