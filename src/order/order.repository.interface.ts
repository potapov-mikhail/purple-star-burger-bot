import { Prisma, Order } from '@prisma/client';

export type FindOneOrderFilter = Pick<Order, 'id'> | Pick<Order, 'userId'>;

export interface IOrderRepository {
	find(args?: Prisma.OrderFindManyArgs): Promise<Order[]>;
	findOneBy(filter: FindOneOrderFilter): Promise<Order | null>;
}
