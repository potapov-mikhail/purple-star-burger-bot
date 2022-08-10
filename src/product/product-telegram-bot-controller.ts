import { inject, injectable } from 'inversify';
import { Context } from 'telegraf';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IPagination } from '../common/types/pagination';
import { ProductReplyView } from './product-reply-view';
import { IProductService } from './product.service.interface';

@injectable()
export class ProductTelegramBotController {
	constructor(@inject(DI_APP_TOKENS.ProductService) private productService: IProductService) {}

	async showBurgerList(ctx: Context, pagination: IPagination): Promise<void> {
		const products = await this.productService.findAllBurgers(pagination);
		const template = ProductReplyView.getBurgersList(products);
		await ctx.replyWithMarkdown(template);
	}

	async showDrinksList(ctx: Context, pagination: IPagination): Promise<void> {
		const drinks = await this.productService.findAllDrinks(pagination);
		const template = ProductReplyView.getDrinksList(drinks);
		await ctx.replyWithMarkdown(template);
	}

	async showBurgerCard(ctx: Context, id: number): Promise<void> {
		const burger = await this.productService.findById(id);
		let template = 'Бурген не найден';

		if (burger) {
			template = ProductReplyView.getBurgerCard(burger);
		}

		await ctx.replyWithMarkdown(template);
	}

	async showDrinkCard(ctx: Context, id: number): Promise<void> {
		const drink = await this.productService.findById(id);
		let template = 'Напиток не найден';

		if (drink) {
			template = ProductReplyView.getDrinkCard(drink);
		}

		await ctx.replyWithMarkdown(template);
	}
}
