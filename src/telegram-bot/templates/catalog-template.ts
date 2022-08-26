import { ProductCategory } from '@prisma/client';
import { ProductEntity } from '../../domains/product/product.entity';
import { TG_TRIGGERS } from '../telegram-bot-triggers';

export abstract class ProductTemplate {
	static getProductList(products: ProductEntity[] = []): string {
		const title = '\n*Purple Star Menu*\n\n';
		const items = products
			.map((config) => ProductTemplate.getProductCard(config, true))
			.join('\n\n');

		return title.concat(items || '🧐 К сожалению, список пуст!');
	}

	static getProductCard(product: ProductEntity, short = false): string {
		const title = `${ProductTemplate.getProductIcon(product.category)}*${product.name}*`;
		const body = `\n${product.description}\n`;
		const linkPrefix =
			product.category === 'Burger' ? TG_TRIGGERS.BurgerCard.prefix : TG_TRIGGERS.DrinkCard.prefix;
		const footer = `\n Цена: ${product.price} Р\n _Подробнее:_ /${linkPrefix}${product.id}`;

		return `${title}${short ? '' : body}${footer}`;
	}

	static getProductIcon(type: ProductCategory): string {
		switch (type) {
			case 'Burger':
				return '🍔';
			case 'Drink':
				return '🥤';
		}

		return '';
	}
}
