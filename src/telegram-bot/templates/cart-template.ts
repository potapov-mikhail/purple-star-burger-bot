import { ProductEntity } from '../../domains/product/product.entity';

export abstract class CartTemplate {
	static getCart(productsWithCount: { product: ProductEntity; count: number }[]): string {
		if (!productsWithCount.length) {
			return '😮 Ваша корзина пуста';
		}

		const divider = '    ';
		return productsWithCount
			.map(({ product, count }, index) => {
				return `${index + 1}. ${product.name}${divider}${product.price} * ${count} = ${
					product.price * count
				} Р`;
			})
			.join('\n');
	}
}
