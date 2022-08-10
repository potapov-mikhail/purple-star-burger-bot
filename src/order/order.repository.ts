import { inject, injectable } from 'inversify';
import { Order, Prisma } from '@prisma/client';
import { DI_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { FindOneOrderFilter, IOrderRepository } from './order.repository.interface';

@injectable()
export class OrderRepository implements IOrderRepository {
	constructor(@inject(DI_TOKENS.PrismaService) private prismaService: IPrismaService) {}
	find(args?: Prisma.OrderFindManyArgs | undefined): Promise<Order[]> {
		return this.prismaService.client.order.findMany(args);
	}
	findOneBy(filter: FindOneOrderFilter): Promise<Order | null> {
		if ('id' in filter) {
			return this.prismaService.client.order.findUnique({ where: { id: filter.id } });
		} else {
			return this.prismaService.client.order.findFirst({ where: filter });
		}
	}
}
