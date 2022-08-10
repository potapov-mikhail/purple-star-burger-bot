import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export interface IReplyTemplate {
	test: string;
}

export interface IReplyTemplateWithExtra extends IReplyTemplate {
	exta: ExtraReplyMessage;
}

export interface IBurgerTemplateConfig {
	id: number;
	name: string;
	description: string;
	price: number;
}

export abstract class ProductReplyView {
	static getBurgersList(configs: IBurgerTemplateConfig[] = []): string {
		return configs.map((config) => ProductReplyView.getBurgerListItem(config)).join('\n\n');
	}

	static getBurgerListItem(config: IBurgerTemplateConfig): string {
		return `🍔*${config.name}* \n ${config.description} \n\n Цена: ${config.price} Р \n _Подробнее:_ /burger${config.id}`;
	}

	static getBurgerCard(config: IBurgerTemplateConfig): string {
		return `🍔*${config.name}* \n ${config.description} \n\n Цена: ${config.price} Р \n _Подробнее:_ /burger${config.id}`;
	}

	static getDrinksList(configs: IBurgerTemplateConfig[] = []): string {
		return configs.map((config) => ProductReplyView.getDrinkListItem(config)).join('\n\n');
	}

	static getDrinkListItem(config: IBurgerTemplateConfig): string {
		return `🥤*${config.name}* \n ${config.description} \n\n Цена: ${config.price} Р \n _Подробнее:_ /burger${config.id}`;
	}

	static getDrinkCard(config: IBurgerTemplateConfig): string {
		return `🥤*${config.name}* \n ${config.description} \n\n Цена: ${config.price} Р \n _Подробнее:_ /burger${config.id}`;
	}
}
