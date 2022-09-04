import { inject, injectable } from 'inversify';
import { Prisma, Product, ProductCategory } from '@prisma/client';
import { APP_TOKENS } from '../../container/tokens';
import { IPrismaService } from '../../common/database/prisma.interface';

export interface IPagination {
	page: number;
	limit: number;
	total: number;
}

interface IDataWithPagination<T> {
	items: T[];
	pagination: IPagination;
}

interface IFindParams {
	category?: ProductCategory;
	query?: string;
	page?: number;
	limit?: number;
}

@injectable()
export class ProductService {
	constructor(@inject(APP_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	async getProductsById(id: number): Promise<Product | null> {
		return this.prismaService.client.product.findUnique({ where: { id } });
	}

	async getProductsByIds(ids: number[]): Promise<Product[]> {
		return this.prismaService.client.product.findMany({ where: { id: { in: ids } } });
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

	async findProducts({
		page,
		limit,
		query,
		category,
	}: IFindParams): Promise<IDataWithPagination<Product>> {
		page = page ?? 1;
		limit = limit ?? 5;

		const skip = (page - 1) * limit;
		const take = limit;

		const where: Prisma.ProductWhereInput = {};

		if (category) {
			where.category = category;
		}

		if (query) {
			where.OR = [
				{ name: { contains: query, mode: 'insensitive' } },
				{ description: { contains: query, mode: 'insensitive' } },
			];
		}

		const [total, items] = await this.prismaService.client.$transaction([
			this.prismaService.client.product.count({ where }),
			this.prismaService.client.product.findMany({
				where,
				skip,
				take,
			}),
		]);

		return { items, pagination: { page, limit, total: Math.ceil(total / limit) } };
	}
}
