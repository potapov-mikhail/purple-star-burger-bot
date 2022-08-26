export interface IProfileContent {
	user: { name: string };
	addresses: { city: string; street: string; house: string }[];
}

export abstract class ProfileTemplate {
	static getProfileCard({ user, addresses }: IProfileContent): string {
		const divider = '   ';
		const infoTemplate = `*Имя:*${divider}${user.name}\n*Кол-во заказов:*${divider}0\n*Адреса доставки:*${divider}`;
		const addressesTemplate = addresses
			.map((address) => ProfileTemplate.getAddress(address))
			.join('\n');

		return `${infoTemplate}\n${addressesTemplate}`;
	}

	static getAddress(address: { city: string; street: string; house: string }): string {
		return `г.${address.city}, ул.${address.street} д.${address.house}`;
	}
}
