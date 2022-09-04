import { Markup } from 'telegraf';
import { TG_TRIGGERS } from '../telegram-bot-triggers';
import { IPagination } from '../../domains/product/product.service';
import { ProductEntity } from '../../domains/product/product.entity';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

export abstract class MarkupTemplate {
	static getPagination(pagination: IPagination, prefix: string, query?: string): ExtraReplyMessage {
		const buttons: InlineKeyboardButton.CallbackButton[] = [];

		if (pagination.total === 0) {
			return Markup.inlineKeyboard(buttons);
		}

		if (pagination.page !== 1) {
			buttons.push({ text: '< Назад', callback_data: `${prefix}-${pagination.page - 1}` });
		}

		if (pagination.page !== pagination.total) {
			buttons.push({ text: 'Вперед >', callback_data: `${prefix}-${pagination.page + 1}` });
		}

		if (query) {
			buttons.forEach((btn) => {
				btn.callback_data = `${btn.callback_data}-${query}`;
			});
		}

		return Markup.inlineKeyboard([buttons]);
	}

	static getProductOptions(product: ProductEntity, count: number): ExtraReplyMessage {
		const buttons = [
			{
				text: `Добавить в корзину` + (count ? ` (${count})` : ''),
				callback_data: `${TG_TRIGGERS.AddToCart.prefix}-${product.id}`,
			},
		];

		if (count) {
			buttons.push({
				text: `Удалить из корзины`,
				callback_data: `${TG_TRIGGERS.DeleteFromCart.prefix}-${product.id}`,
			});
		}

		return Markup.inlineKeyboard([buttons]);
	}

	static getCartOptions(): ExtraReplyMessage {
		return Markup.inlineKeyboard([{ text: 'Оплатить', callback_data: TG_TRIGGERS.Pay.prefix }]);
	}
}
