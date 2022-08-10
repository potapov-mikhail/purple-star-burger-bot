import { Product } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IPagination } from '../common/types/pagination';
import { IProductService } from './product.service.interface';
import { IProductRepository } from './product.repository.interface';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { computePagination } from '../utils/compute-pagination';

const BURGER_CATEGORY_ID = 1;
const DRINKS_CATEGORY_ID = 3;

@injectable()
export class ProductService implements IProductService {
	constructor(
		@inject(DI_APP_TOKENS.ProductRepository) private productRepository: IProductRepository,
	) {}

	findAllBurgers(params: IPagination = { page: 1, limit: 10 }): Promise<Product[]> {
		const { skip, take } = computePagination(params.page, params.limit);
		return this.productRepository.find({
			where: { ProductOnCategory: { every: { categoryId: BURGER_CATEGORY_ID } } },
			skip,
			take,
		});
	}

	findAllDrinks(params: IPagination = { page: 1, limit: 20 }): Promise<Product[]> {
		const { skip, take } = computePagination(params.page, params.limit);
		return this.productRepository.find({
			where: { ProductOnCategory: { every: { categoryId: DRINKS_CATEGORY_ID } } },
			skip,
			take,
		});
	}

	findById(id: number): Promise<Product | null> {
		return this.productRepository.findOneBy({ id });
	}
}
