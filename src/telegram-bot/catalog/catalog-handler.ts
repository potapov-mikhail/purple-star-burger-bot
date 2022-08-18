import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { parseId } from '../../utils/parse-id';
import {
	TelegramBotActionContext,
	TelegramBotCommandContext,
	TelegramBotHeartContext,
} from '../core/telegram-bot-context.interface';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { ValidateMatchId } from '../middleware/validate-id';
import { CatalogAction } from './catalog-actions';
import { CatalogReplyService } from './catalog-reply-service';

@injectable()
export class CatalogHandler extends TelegramBotHandler {
	constructor(
		@inject(DI_APP_TOKENS.ProductTelegramBotController)
		private readonly catalogReplyService: CatalogReplyService,
	) {
		super();

		this.bindCommands([
			{
				name: CatalogAction.burgerList,
				handler: this.showBurgerList.bind(this),
			},
			{
				name: CatalogAction.drinkList,
				handler: this.showDrinkList.bind(this),
			},
		]);

		this.bindActions([
			{
				name: CatalogAction.burgerChangePage,
				handler: this.burgerChangePage.bind(this),
			},
			{
				name: CatalogAction.drinkChangePage,
				handler: this.drinkChangePage.bind(this),
			},
		]);

		this.bindHears([
			{
				name: CatalogAction.burgerCard,
				middleware: new ValidateMatchId(),
				handler: this.showBurgerCard.bind(this),
			},
			{
				name: CatalogAction.drinkCard,
				middleware: new ValidateMatchId(),
				handler: this.showDrinkCard.bind(this),
			},
		]);
	}

	private async showBurgerList(ctx: TelegramBotCommandContext): Promise<void> {
		this.catalogReplyService.showBurgerList(ctx, { page: 1, limit: 1 });
	}

	private async showDrinkList(ctx: TelegramBotCommandContext): Promise<void> {
		this.catalogReplyService.showDrinksList(ctx, { page: 1, limit: 1 });
	}

	private async burgerChangePage(ctx: TelegramBotActionContext): Promise<void> {
		const match = ctx.match[0];
		const page = Number(match.split('-')[1]);
		this.catalogReplyService.replaceBurgerList(ctx, { page, limit: 1 });
	}

	private async drinkChangePage(ctx: TelegramBotActionContext): Promise<void> {
		const match = ctx.match[0];
		const page = Number(match.split('-')[1]);
		this.catalogReplyService.replaceDrinksList(ctx, { page, limit: 1 });
	}

	private async showBurgerCard(ctx: TelegramBotHeartContext): Promise<void> {
		const id = this.getIdFromCtx(ctx);
		this.catalogReplyService.showBurgerCard(ctx, id);
	}

	private async showDrinkCard(ctx: TelegramBotHeartContext): Promise<void> {
		const id = this.getIdFromCtx(ctx);
		this.catalogReplyService.showDrinkCard(ctx, id);
	}

	private getIdFromCtx(ctx: TelegramBotHeartContext): number {
		return parseId(ctx.match[0])!;
	}
}
