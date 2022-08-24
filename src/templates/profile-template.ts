export interface IProfileContent {
	user: { name: string };
	addresses: { city: string; street: string; house: string }[];
}

export abstract class ProfileTemplate {
	static getProfileCard({ user, addresses }: IProfileContent): string {
		const divider = '   ';
		const infoTemplate = `*Имя:*${divider}${user.name}\n*Кол-во заказов:*${divider}0\n*Адреса доставки:*${divider}`;
		const addressesTemplate = addresses
			.map((address) => `г.${address.city}, ул.${address.street} д.${address.house}`)
			.join('\n');

		return `${infoTemplate}\n${addressesTemplate}`;
	}
}
