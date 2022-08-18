import { Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import { CORE_TOKENS } from '../core/di/tokens';
import LocalSession from 'telegraf-session-local';
import { TG_BOT_TOKENS } from './di/tokens';
import { ITelegramBot } from './core/telegram-bot.interface';
import { IConfigService } from '../core/config/config.interface';
import { ITelegramBotHandlerManager } from './core/telegram-bot-handler-manager';
import { ITelegramBotGlobalErrorHandler } from './core/telegram-bot-global-error-handler';

@injectable()
export class TelegramBot implements ITelegramBot {
	private readonly telegraf: Telegraf;

	constructor(
		@inject(CORE_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(TG_BOT_TOKENS.TelegramBotHandlerManager)
		private readonly telegramBotHandlerManager: ITelegramBotHandlerManager,
		@inject(TG_BOT_TOKENS.TelegramBotGlobalErrorHandler)
		private readonly telegramBotGlobalErrorHandler: ITelegramBotGlobalErrorHandler,
	) {
		this.configService.check(['DATABASE_URL', 'TG_BOT_TOKEN', 'TG_SESSTION_DATABASE_NAME']);

		const token = this.configService.get('TG_BOT_TOKEN');
		const sessionDatabase = this.configService.get('TG_SESSTION_DATABASE_NAME');

		this.telegraf = new Telegraf(token);
		this.telegraf.use(new LocalSession({ database: `${sessionDatabase}.json` }));
		this.telegraf.use(this.telegramBotHandlerManager.middleware());
		this.telegraf.catch((e) => {
			this.telegramBotGlobalErrorHandler.handleError(e);
		});
	}

	run(): Promise<void> {
		return this.telegraf.launch();
	}

	stop(): void {
		this.telegraf.stop();
	}
}
