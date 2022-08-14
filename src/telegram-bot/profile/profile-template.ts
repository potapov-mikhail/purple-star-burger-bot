export interface IProfileAddressContent {
	city: string;
	street: string;
	house: string;
}

export interface IProfileUserContent {
	name: string;
}

export interface IProfileContent {
	user: IProfileUserContent;
	addresses: IProfileAddressContent[];
}

export abstract class ProfileTemplate {
	static getProfileCard(content: IProfileContent): string {
		const userInfo = ProfileTemplate.getUserInfo(content.user);
		const addressesInfo = ProfileTemplate.getAddressList(content.addresses);

		let text = userInfo;

		if (addressesInfo.length) {
			text = text.concat(`\nАдреса:\n${addressesInfo}`);
		}

		return text;
	}

	static getUserInfo(user: IProfileUserContent): string {
		return `Имя: ${user.name}`;
	}

	static getAddressList(address: IProfileAddressContent[] = []): string {
		return address.map((address) => ProfileTemplate.getAddress(address)).join('\n');
	}

	static getAddress(address: IProfileAddressContent): string {
		return `Город: ${address.city} Улица: ${address.street} Дом: ${address.house}`;
	}
}
