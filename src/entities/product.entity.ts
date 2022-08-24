import { ProductCategory } from '@prisma/client';

interface ProductParams {
	id?: number;
	name: string;
	description: string;
	price: number;
	category: ProductCategory;
}

export class ProductEntity {
	id?: number;
	name: string;
	description: string;
	price: number;
	category: ProductCategory;

	constructor(params: ProductParams) {
		this.id = params.id;
		this.name = params.name;
		this.description = params.description;
		this.price = params.price;
		this.category = params.category;
	}
}
