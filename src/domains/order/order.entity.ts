import { OrderStatus } from '@prisma/client';
import { LabeledPrice } from 'telegraf/typings/core/types/typegram';

interface IDataItem {
	id: number;
	name: string;
	price: number;
	count: number;
}

interface IOrderData {
	items: IDataItem[];
}

interface OrderParams {
	id?: number;
	data?: IOrderData;
	status?: OrderStatus;
}

export class OrderEntity {
	id?: number;
	paid: boolean;
	data: IOrderData;
	status: OrderStatus;

	constructor(params?: OrderParams) {
		this.id = params?.id;
		this.status = params?.status ?? OrderStatus.Created;
		this.data = params?.data ?? { items: [] };
	}

	get price(): number {
		return this.data.items.reduce((sum, item) => sum + item.count, 0);
	}

	addItem(item: IDataItem): void {
		this.data.items.push(item);
	}

	getLabeledPrices(): LabeledPrice[] {
		const prices: LabeledPrice[] = [];

		for (const item of this.data.items) {
			const price = Array.from({ length: item.count }).fill({
				label: item.name,
				amount: item.price * 100,
			}) as LabeledPrice[];

			prices.push(...price);
		}

		return prices;
	}
}
