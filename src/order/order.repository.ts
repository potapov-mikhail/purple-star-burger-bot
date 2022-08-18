import { inject, injectable } from 'inversify';
import { CORE_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { BaseRepository } from '../common/repository/base-repository';
import { IOrderRepository, OrderPrismaModel } from './order.repository.interface';

@injectable()
export class OrderRepository extends BaseRepository<OrderPrismaModel> implements IOrderRepository {
	constructor(@inject(CORE_TOKENS.PrismaService) private prismaService: IPrismaService) {
		super(prismaService.client.order);
	}
}
