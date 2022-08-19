import { Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import { CORE_TOKENS } from '../core/di/tokens';
import LocalSession from 'telegraf-session-local';
import { TG_BOT_TOKENS } from './di/tokens';
import { ITelegramBot } from './core/telegram-bot.interface';
import { IConfigService } from '../core/config/config.interface';
import { ITelegramBotHandlerManager } from './core/telegram-bot-handler-manager';
import { ITelegramBotGlobalErrorHandler } from './core/telegram-bot-global-error-handler';
import { TELEGRAM_BOT_COMMANDS } from './telegram-bot-commands-list';
import { hasCommandDifference } from '../utils/has-command-difference';
import { ILoggerService } from '../core/logger/logger.interface';

@injectable()
export class TelegramBot implements ITelegramBot {
	private readonly telegraf: Telegraf;

	constructor(
		@inject(CORE_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(CORE_TOKENS.LoggerService) private readonly loggerService: ILoggerService,
		@inject(TG_BOT_TOKENS.TelegramBotHandlerManager)
		private readonly telegramBotHandlerManager: ITelegramBotHandlerManager,
		@inject(TG_BOT_TOKENS.TelegramBotGlobalErrorHandler)
		private readonly telegramBotGlobalErrorHandler: ITelegramBotGlobalErrorHandler,
	) {
		this.loggerService.setPrefix(this.constructor.name);
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

	async run(): Promise<void> {
		await this.initCommandsList();
		return this.telegraf.launch();
	}

	stop(): void {
		this.telegraf.stop();
	}

	private async initCommandsList(): Promise<void> {
		const commands = await this.telegraf.telegram.getMyCommands();
		if (hasCommandDifference(commands, TELEGRAM_BOT_COMMANDS)) {
			await this.telegraf.telegram.deleteMyCommands();
			await this.telegraf.telegram.setMyCommands(TELEGRAM_BOT_COMMANDS);
			this.loggerService.log('Command list was successfully changed');
		}
	}
}
