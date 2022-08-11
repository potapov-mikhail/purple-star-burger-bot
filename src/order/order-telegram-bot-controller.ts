import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IUserService } from '../user/user.service.interface';
import { OrderReplyView } from './order-reply-view';
import { IOrderService } from './order.service.interface';

@injectable()
export class OrderTelegramBotController {
	constructor(
		@inject(DI_APP_TOKENS.UserService) private userService: IUserService,
		@inject(DI_APP_TOKENS.OrderService) private orderService: IOrderService,
	) {}

	async showOrderList(ctx: Context, id: number): Promise<void> {
		const user = await this.userService.findByTgId(id);
		const orders = await this.orderService.findAllByUserId(user!.id);
		const template = OrderReplyView.getOrdersList(orders as any);

		if (template) {
			await ctx.replyWithMarkdown(template);
		} else {
			await ctx.replyWithMarkdown('Не найден');
		}
	}
}
