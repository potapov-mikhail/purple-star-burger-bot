import { inject, injectable } from 'inversify';
import { SessionContext } from 'telegraf/typings/session';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { parseId } from '../../utils/parse-id';
import { TelegramBotHandler } from '../core/telegram-bot-handler/telegram-bot-handler';
import { TelegramBotMatchedContext } from '../core/telegram-bot.interface';
import { validateId } from '../middleware/validate-id';
import { CatalogAction } from './catalog-actions';
import { CatalogReplyService } from './catalog-reply-service';

@injectable()
export class CatalogHandler extends TelegramBotHandler {
	constructor(
		@inject(DI_APP_TOKENS.ProductTelegramBotController)
		private readonly catalogReplyService: CatalogReplyService,
	) {
		super();

		this.composer.command(CatalogAction.burgerList, (ctx: SessionContext<{}>) => {
			this.catalogReplyService.showBurgerList(ctx, { page: 1, limit: 1 });
		});

		this.composer.hears(CatalogAction.burgerCard, validateId, (ctx) => {
			const id = parseId(ctx.match[0])!;
			this.catalogReplyService.showBurgerCard(ctx, id);
		});

		this.composer.action(
			CatalogAction.burgerChangePage,
			(
				ctx: TelegramBotMatchedContext<
					SessionContext<{}> & { match: RegExpExecArray },
					'callback_query'
				>,
			) => {
				const match = ctx.match[0];
				const page = Number(match.split('-')[1]);
				this.catalogReplyService.replaceBurgerList(ctx, { page, limit: 1 });
			},
		);

		this.composer.command(CatalogAction.drinkList, (ctx) => {
			this.catalogReplyService.showDrinksList(ctx, { page: 1, limit: 1 });
		});

		this.composer.hears(CatalogAction.drinkCard, validateId, (ctx) => {
			const id = parseId(ctx.match[0])!;
			this.catalogReplyService.showDrinkCard(ctx, id);
		});

		this.composer.action(CatalogAction.drinkChangePage, (ctx) => {
			const match = (ctx as any).match[0] as string;
			const page = Number(match.split('-')[1]);
		});
	}
}
