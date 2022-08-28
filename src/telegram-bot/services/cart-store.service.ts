import { injectable } from 'inversify';
import { ITgContext, ITgProductCart } from '../common/telegram-bot.interface';

@injectable()
export class TgCartService {
	addProductToCart(ctx: ITgContext, productId: number): void {
		this.updateProductCount(ctx, productId, 1);
	}

	deleteProductFromCart(ctx: ITgContext, productId: number): void {
		this.updateProductCount(ctx, productId, -1);
	}

	getCart(ctx: ITgContext): ITgProductCart {
		return ctx.session.productCart ?? { items: {} };
	}

	getProductCount(ctx: ITgContext, productId: number): number {
		return this.getCart(ctx).items[productId] ?? 0;
	}

	getProductsFromCart(ctx: ITgContext): ITgProductCart['items'] {
		return this.getCart(ctx)['items'] ?? {};
	}

	private updateProductCount(ctx: ITgContext, productId: number, delta: number): void {
		if (typeof ctx.session.productCart !== 'object') {
			ctx.session.productCart = { items: {} };
		}

		const cart = this.getCart(ctx);
		const count = (Number(cart.items[productId]) || 0) + delta;
		const newCart = { ...cart, items: { ...cart.items, [productId]: count } };

		if (!newCart.items[productId]) {
			delete newCart.items[productId];
		}

		Object.assign(ctx.session.productCart, newCart);
	}
}
