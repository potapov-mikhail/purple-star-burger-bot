import { Prisma, Product } from '@prisma/client';

export type FindOneProductFilter = Pick<Product, 'id'> | Pick<Product, 'name'>;

export interface IProductRepository {
	find(args?: Prisma.ProductFindManyArgs): Promise<Product[]>;
	findOneBy(filter: FindOneProductFilter): Promise<Product | null>;
}
