import { inject, injectable } from 'inversify';
import { Prisma, Product } from '@prisma/client';
import { DI_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { FindOneProductFilter, IProductRepository } from './product.repository.interface';

@injectable()
export class ProductRepository implements IProductRepository {
	constructor(@inject(DI_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	find(args?: Prisma.ProductFindManyArgs): Promise<Product[]> {
		return this.prismaService.client.product.findMany(args);
	}

	findOneBy(filter: FindOneProductFilter): Promise<Product | null> {
		if ('id' in filter) {
			return this.prismaService.client.product.findUnique({ where: { id: filter.id } });
		} else {
			return this.prismaService.client.product.findFirst({ where: filter });
		}
	}
}
