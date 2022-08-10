import { Order } from '@prisma/client';

export interface IOrderService {
	findById(id: number): Promise<Order | null>;
	findAllByUserId(userId: number): Promise<Order[]>;
}
