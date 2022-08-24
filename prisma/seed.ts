import {
	Address,
	Category,
	City,
	Order,
	PrismaClient,
	Product,
	ProductOnCategory,
	User,
} from '@prisma/client';

const prisma = new PrismaClient();

type UserMock = Pick<User, 'name' | 'tgId'>;
type ProductMock = Pick<Product, 'name' | 'description' | 'price' | 'type'> & {
	categories: string[];
};
type CategoryMock = Pick<Category, 'name'>;
type AddressMock = Pick<Address, 'city' | 'street' | 'house' | 'userId'>;
type ProductOnCategoryMock = Pick<ProductOnCategory, 'categoryId' | 'productId'>;
type OrderMock = Pick<Order, 'userId' | 'paid' | 'data' | 'totalPrice'>;
type CityMock = Pick<City, 'name'>;

const DEFAULT_USERS: UserMock[] = [
	{ name: 'Михаил', tgId: 1 },
	{ name: 'Дмитрий', tgId: 2 },
];

const DEFAULT_CITIES: CityMock[] = [{ name: 'Москва' }, { name: 'Омск' }, { name: 'Красноярск' }];

const DEFAULT_PRODUCTS: ProductMock[] = [
	{
		name: 'Бургер вип блэк ангус',
		description:
			'Эксклюзивный бургер с фирменной черной булочкой, сочной котлетой из мраморной говядины Блэк Ангус, грибами, деликатесным сыром фета и сыром чеддер, свежими помидорами, листьями салата, кольцами красного лука и маринованными огурчиками. Особый вкус и сочность бургеру придает карамелизированная груша в сочетании с джемом из черной смородины. Заправляется фирменным соусом с трюфельным маслом.',
		price: 929,
		categories: ['Бургер'],
		type: 'Burger',
	},
	{
		name: 'Бургер спайси блэк ангус',
		description:
			'Пикантная новинка! Домашняя булочка, сочная котлета из мраморной говядины Блэк Ангус, обжаренная с сыром чеддер, свежий салат, гавайский соус, ломтики помидора, маринованные огурчики и незабываемое сочетание острого соуса и джема из черной смородины — настоящее гастрономическое удовольствие.',
		price: 519,
		categories: ['Бургер', 'Спайси'],
		type: 'Burger',
	},
	{
		name: 'Бургер вип блэк ангус дабл',
		description:
			'Эксклюзивный бургер с фирменной черной булочкой, сочной котлетой из мраморной говядины Блэк Ангус, грибами, деликатесным сыром фета и сыром чеддер, свежими помидорами, листьями салата, кольцами красного лука и маринованными огурчиками. Особый вкус и сочность бургеру придает карамелизированная груша в сочетании с джемом из черной смородины. Заправляется фирменным соусом с трюфельным маслом.',
		price: 929,
		categories: ['Бургер'],
		type: 'Burger',
	},
	{
		name: 'Бургер спайси блэк ангус дабл',
		description:
			'Пикантная новинка! Домашняя булочка, сочная котлета из мраморной говядины Блэк Ангус, обжаренная с сыром чеддер, свежий салат, гавайский соус, ломтики помидора, маринованные огурчики и незабываемое сочетание острого соуса и джема из черной смородины — настоящее гастрономическое удовольствие.',
		price: 519,
		categories: ['Бургер', 'Спайси'],
		type: 'Burger',
	},
	{
		name: 'Супер острый Бургер вип блэк ангус',
		description:
			'Эксклюзивный бургер с фирменной черной булочкой, сочной котлетой из мраморной говядины Блэк Ангус, грибами, деликатесным сыром фета и сыром чеддер, свежими помидорами, листьями салата, кольцами красного лука и маринованными огурчиками. Особый вкус и сочность бургеру придает карамелизированная груша в сочетании с джемом из черной смородины. Заправляется фирменным соусом с трюфельным маслом.',
		price: 929,
		categories: ['Бургер'],
		type: 'Burger',
	},
	{
		name: 'Супер острый  Бургер спайси блэк ангус',
		description:
			'Пикантная новинка! Домашняя булочка, сочная котлета из мраморной говядины Блэк Ангус, обжаренная с сыром чеддер, свежий салат, гавайский соус, ломтики помидора, маринованные огурчики и незабываемое сочетание острого соуса и джема из черной смородины — настоящее гастрономическое удовольствие.',
		price: 519,
		categories: ['Бургер', 'Спайси'],
		type: 'Burger',
	},
	{
		name: 'Coca-Cola',
		description: 'Газированный безалкогольный напиток, производимый компанией Coca-Cola.',
		price: 150,
		categories: ['Напиток'],
		type: 'Drink',
	},
	{
		name: 'Sprite',
		description:
			'Газированный безалкогольный напиток со вкусом лайма и лимона, принадлежащий американской компании The Coca-Cola Company.',
		price: 100,
		categories: ['Напиток'],
		type: 'Drink',
	},
];

const DEFAULT_CATEGORIES: CategoryMock[] = [
	{ name: 'Бургер' },
	{ name: 'Спайси' },
	{ name: 'Напиток' },
];

function getAddressesMocks(usersIds: number[] = []): AddressMock[] {
	return usersIds.map((userId) => {
		return userId % 2
			? { userId, city: 'Москва', street: 'Новый Арбат', house: '17' }
			: { userId, city: 'Москва', street: 'Цветной бульвар', house: '11с2' };
	});
}

function getOrdersMocks(usersIds: number[] = []): OrderMock[] {
	return usersIds.map((userId) => {
		return userId % 2
			? {
					userId,
					paid: false,
					totalPrice: 1049,
					data: {
						items: [
							{ name: 'Бургер спайси блэк ангус', price: 929, count: 1 },
							{ name: 'Coca-Cola', price: 120, count: 1 },
						],
					},
			  }
			: {
					userId,
					paid: true,
					totalPrice: 2158,
					data: {
						items: [
							{ name: 'Бургер вип блэк ангус', price: 929, count: 2 },
							{ name: 'Sprite', price: 100, count: 3 },
						],
					},
			  };
	});
}

function getProductsOnCategoriesMocks(
	products: Product[],
	categories: Category[],
): ProductOnCategoryMock[] {
	return DEFAULT_PRODUCTS.map((mock) => {
		const createdProduct = products.find((p) => p.name === mock.name);
		const createdCategories = categories.filter((c) =>
			mock.categories.some((name) => c.name === name),
		);

		return { product: createdProduct, categories: createdCategories };
	})
		.filter((item) => item.product && item.categories.length)
		.flatMap(({ product, categories }) => {
			return categories.map((item) => {
				return {
					categoryId: item.id,
					productId: product!.id,
				};
			});
		});
}

async function main(): Promise<void> {
	await prisma.$connect();

	await prisma.user.createMany({
		data: DEFAULT_USERS,
		skipDuplicates: true,
	});

	const users = await prisma.user.findMany();

	await prisma.city.createMany({
		data: DEFAULT_CITIES,
	});

	await prisma.product.createMany({
		data: DEFAULT_PRODUCTS.map((p) => ({
			name: p.name,
			price: p.price,
			description: p.description,
		})),
	});

	const products = await prisma.product.findMany();

	await prisma.category.createMany({
		data: DEFAULT_CATEGORIES,
	});

	const categories = await prisma.category.findMany();

	await prisma.address.createMany({
		data: getAddressesMocks(users.map((user) => user.id)),
	});

	await prisma.productOnCategory.createMany({
		data: getProductsOnCategoriesMocks(products, categories),
	});

	await prisma.order.createMany({
		data: getOrdersMocks(users.map((user) => user.id)) as any,
	});

	await prisma.$disconnect();
}

main().then(() => {
	console.log('Seeding your database was success');
});
