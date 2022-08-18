import { Product } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../common/di/tokens';
import { IPagination } from '../common/types/pagination';
import { IProductService } from './product.service.interface';
import { computePagination } from '../utils/compute-pagination';
import { IProductRepository } from './product.repository.interface';

const BURGER_CATEGORY_ID = 1;
const DRINKS_CATEGORY_ID = 3;
const DEFAULT_LIST_LIMIT = 10;

@injectable()
export class ProductService implements IProductService {
	constructor(
		@inject(APP_TOKENS.ProductRepository) private productRepository: IProductRepository,
	) {}

	findAllBurgers(params: IPagination = { page: 1, limit: DEFAULT_LIST_LIMIT }): Promise<Product[]> {
		const { skip, take } = computePagination(params.page, params.limit);

		console.log(skip, take);
		return this.productRepository.findMany({
			where: { ProductOnCategory: { some: { categoryId: BURGER_CATEGORY_ID } } },
			skip,
			take,
		});
	}

	findAllDrinks(params: IPagination = { page: 1, limit: DEFAULT_LIST_LIMIT }): Promise<Product[]> {
		const { skip, take } = computePagination(params.page, params.limit);
		return this.productRepository.findMany({
			where: { ProductOnCategory: { some: { categoryId: DRINKS_CATEGORY_ID } } },
			skip,
			take,
		});
	}

	findById(id: number): Promise<Product | null> {
		return this.productRepository.findUnique({ where: { id } });
	}
}
