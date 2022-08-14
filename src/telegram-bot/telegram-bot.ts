import { Telegraf } from 'telegraf';
import { DI_TOKENS } from '../core/di/tokens';
import { inject, injectable } from 'inversify';
import { ITelegramBot } from './core/telegram-bot.interface';
import { IConfigService } from '../core/config/config.interface';
import { ITelegramBotHandler } from './core/telegram-bot-handler/telegram-bot-handler.interface';
import LocalSession from 'telegraf-session-local';

@injectable()
export class TelegramBot implements ITelegramBot {
	private readonly telegraf: Telegraf;

	constructor(
		@inject(DI_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(DI_TOKENS.TelegramBotHandlerManager)
		private readonly handlerManager: ITelegramBotHandler,
	) {
		const token = this.configService.get('TG_BOT_TOKEN');

		if (!token) {
			throw new Error('TG_BOT_TOKEN is not defined');
		}

		this.telegraf = new Telegraf(token);
		this.telegraf.use(new LocalSession({ database: 'sessions.json' }));
		this.telegraf.use(this.handlerManager.middleware());

		this.telegraf.catch((e) => {
			console.log('CATCH ERROR', e);
		});
	}

	run(): Promise<void> {
		return this.telegraf.launch();
	}

	stop(): void {
		this.telegraf.stop();
	}
}
