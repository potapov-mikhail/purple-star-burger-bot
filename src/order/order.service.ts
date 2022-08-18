import { Order } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IOrderService } from './order.service.interface';
import { IOrderRepository } from './order.repository.interface';

@injectable()
export class OrderService implements IOrderService {
	constructor(@inject(DI_APP_TOKENS.OrderRepository) private orderRepository: IOrderRepository) {}

	findById(id: number): Promise<Order | null> {
		return this.orderRepository.findUnique({ where: { id } });
	}

	findAllByUserId(userId: number): Promise<Order[]> {
		return this.orderRepository.findMany({ where: { userId } });
	}
}
