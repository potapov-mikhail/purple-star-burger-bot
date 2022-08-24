import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

type ProductMock = Pick<Product, 'name' | 'description' | 'price' | 'category'>;

const BURGERS: ProductMock[] = Array.from({ length: 20 }).map((_, index) => {
	return {
		name: `Бургер ${index}`,
		description:
			'Эксклюзивный бургер с фирменной черной булочкой, сочной котлетой из мраморной говядины Блэк Ангус, грибами, деликатесным сыром фета и сыром чеддер, свежими помидорами, листьями салата, кольцами красного лука и маринованными огурчиками. Особый вкус и сочность бургеру придает карамелизированная груша в сочетании с джемом из черной смородины. Заправляется фирменным соусом с трюфельным маслом.',
		price: 929,
		category: 'Burger',
	};
});

const DRINKS: ProductMock[] = Array.from({ length: 20 }).map((_, index) => {
	return {
		name: `Напиток ${index}`,
		description: 'Газированный безалкогольный напиток, производимый компанией Coca-Cola.',
		price: 929,
		category: 'Drink',
	};
});

async function main(): Promise<void> {
	await prisma.$connect();

	await prisma.product.createMany({
		data: BURGERS.concat(DRINKS),
	});

	await prisma.$disconnect();
}

main().then(() => {
	console.log('Seeding your database was success');
});
