import { ProductType } from '@prisma/client';

interface ProductParams {
	id?: number;
	name: string;
	description: string;
	price: number;
	type: ProductType;
}

export class ProductEntity {
	id?: number;
	name: string;
	description: string;
	price: number;
	type: ProductType;

	constructor(params: ProductParams) {
		this.id = params.id;
		this.name = params.name;
		this.description = params.description;
		this.price = params.price;
		this.type = params.type;
	}
}
