import { inject, injectable } from 'inversify';
import { parseId } from '../../utils/parse-id';
import { TG_BOT_TOKENS } from '../di/tokens';
import { CatalogAction } from './catalog-actions';
import { ValidateMatchId } from '../middleware/validate-id';
import { CatalogReplyService } from './catalog-reply-service';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import {
	TelegramBotActionContext,
	TelegramBotCommandContext,
	TelegramBotHeartContext,
} from '../core/telegram-bot-context.interface';

const DEFAULT_LIMIT = 5;

@injectable()
export class CatalogHandler extends TelegramBotHandler {
	constructor(
		@inject(TG_BOT_TOKENS.CatalogReplyService)
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
		this.catalogReplyService.showBurgerList(ctx, { page: 1, limit: DEFAULT_LIMIT });
	}

	private async showDrinkList(ctx: TelegramBotCommandContext): Promise<void> {
		this.catalogReplyService.showDrinksList(ctx, { page: 1, limit: DEFAULT_LIMIT });
	}

	private async burgerChangePage(ctx: TelegramBotActionContext): Promise<void> {
		const match = ctx.match[0];
		const page = Number(match.split('-')[1]);
		this.catalogReplyService.showBurgerList(ctx, { page, limit: DEFAULT_LIMIT }, true);
	}

	private async drinkChangePage(ctx: TelegramBotActionContext): Promise<void> {
		const match = ctx.match[0];
		const page = Number(match.split('-')[1]);
		this.catalogReplyService.showDrinksList(ctx, { page, limit: DEFAULT_LIMIT }, true);
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
