import { Telegraf } from 'telegraf';
import { DI_TOKENS } from '../core/di/tokens';
import { inject, injectable } from 'inversify';
import { ITelegramBot } from './telegram-bot.interface';
import { IConfigService } from '../core/config/config.interface';
import { ITelegramBotHandler } from './telegram-bot-handler.interface';

@injectable()
export class TelegramBot implements ITelegramBot {
	private readonly telegraf: Telegraf;

	constructor(
		@inject(DI_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(DI_TOKENS.TelegramBotHandler) private readonly telegramBotHandler: ITelegramBotHandler,
	) {
		const token = this.configService.get('TG_BOT_TOKEN');

		if (!token) {
			throw new Error('TG_BOT_TOKEN is not defined');
		}

		this.telegraf = new Telegraf(token);
		this.telegraf.use(this.telegramBotHandler.middleware());
	}

	run(): Promise<void> {
		return this.telegraf.launch();
	}

	stop(): void {
		this.telegraf.stop();
	}
}
