interface IOrderData {
	items: { name: string; count: number; price: number }[];
}

export interface IOrderTemplateConfig {
	id: number;
	paid: boolean;
	data: IOrderData;
	createdAt: Date;
}

export abstract class OrderReplyView {
	static getOrdersList(configs: IOrderTemplateConfig[] = []): string {
		return configs.map((config) => OrderReplyView.getOrderListItem(config)).join('\n');
	}

	static getOrderListItem(config: IOrderTemplateConfig): string {
		return `Статус: ${config.paid ? 'оплачен' : 'неоплачен'}\nДата: ${config.createdAt.getDate()}-${
			config.createdAt.getMonth() + 1
		}-${config.createdAt.getFullYear()}\n${OrderReplyView.getOrderData(
			config.data,
		)}\n\nОбщая цена: ДОБАВИТЬ!!!`;
	}

	static getOrderData(config: IOrderData): string {
		return config.items.map((item) => OrderReplyView.getOrderDataItem(item)).join('\n\n');
	}

	static getOrderDataItem(config: IOrderData['items'][number]): string {
		return `Имя: ${config.name} Кол-во: ${config.count} Цена: ${config.price * config.count}`;
	}
}
