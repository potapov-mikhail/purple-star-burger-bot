export interface IAddressTemplateConfig {
	id: number;
	city: string;
	street: string;
	house: string;
}

export interface IUserTemplateConfig {
	id: number;
	name: string;
}

export abstract class ProfileReplyView {
	static getProfileCard(
		user: IUserTemplateConfig,
		addresses: IAddressTemplateConfig[] = [],
	): string {
		return `Имя: ${user.name}\n\nСписок адресов:\n${ProfileReplyView.getAddressesList(addresses)}`;
	}

	static getAddressesList(configs: IAddressTemplateConfig[] = []): string {
		return configs.map((config) => ProfileReplyView.getAddressListItem(config)).join('\n');
	}

	static getAddressListItem(config: IAddressTemplateConfig): string {
		return `Город: ${config.city} Удлица: ${config.street} Дом: ${config.house}`;
	}
}
