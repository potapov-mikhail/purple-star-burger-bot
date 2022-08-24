import { inject, injectable } from 'inversify';
import { Product, ProductCategory } from '@prisma/client';
import { APP_TOKENS } from '../container/tokens';
import { IPrismaService } from '../common/database/prisma.interface';

export interface IPagination {
	page: number;
	limit: number;
	total: number;
}

interface IDataWithPagination<T> {
	items: T[];
	pagination: IPagination;
}

@injectable()
export class ProductService {
	constructor(@inject(APP_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	async getProductsById(id: number): Promise<Product | null> {
		return this.prismaService.client.product.findUnique({ where: { id } });
	}

	async getProductsByCategory(
		category: ProductCategory,
		page: number,
		limit = 5,
	): Promise<IDataWithPagination<Product>> {
		const [total, items] = await this.prismaService.client.$transaction([
			this.prismaService.client.product.count({ where: { category } }),
			this.prismaService.client.product.findMany({
				where: { category },
				skip: (page - 1) * limit,
				take: limit,
			}),
		]);

		return { items, pagination: { page, limit, total: Math.ceil(total / limit) } };
	}
}
