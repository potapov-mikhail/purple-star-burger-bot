import { inject, injectable } from 'inversify';
import { CORE_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { BaseRepository } from '../common/repository/base-repository';
import { IProductRepository, ProductPrismaModel } from './product.repository.interface';

@injectable()
export class ProductRepository
	extends BaseRepository<ProductPrismaModel>
	implements IProductRepository
{
	constructor(@inject(CORE_TOKENS.PrismaService) private prismaService: IPrismaService) {
		super(prismaService.client.product);
	}
}
