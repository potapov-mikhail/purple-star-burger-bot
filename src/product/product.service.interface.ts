import { Product } from '@prisma/client';
import { IPagination } from '../common/types/pagination';

export interface IProductService {
	findById(id: number): Promise<Product | null>;
	findAllBurgers(params?: IPagination): Promise<Product[]>;
	findAllDrinks(params?: IPagination): Promise<Product[]>;
}
