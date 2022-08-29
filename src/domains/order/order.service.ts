import { Order, OrderStatus } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { IPrismaService } from '../../common/database/prisma.interface';
import { OrderEntity } from './order.entity';

@injectable()
export class OrderService {
	constructor(@inject(APP_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	async getOrderById(id: number): Promise<Order | null> {
		return this.prismaService.client.order.findUnique({ where: { id } });
	}

	async updateOrderStatusById(id: number, status: OrderStatus): Promise<Order | null> {
		return this.prismaService.client.order.update({ data: { status }, where: { id } });
	}

	async createOrder({ data, price, status }: OrderEntity): Promise<Order> {
		return this.prismaService.client.order.create({
			data: { status, price, data: data as any },
		});
	}
}
