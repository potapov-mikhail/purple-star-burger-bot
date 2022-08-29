import { Telegraf } from 'telegraf';
import { inject, injectable } from 'inversify';
import LocalSession from 'telegraf-session-local';
import { APP_TOKENS } from '../container/tokens';
import { TELEGRAM_BOT_COMMANDS } from './telegram-bot-triggers';
import { IConfigService } from '../common/config/config.interface';
import { ILoggerService } from '../common/logger/logger.interface';
import { BotCommand } from 'telegraf/typings/core/types/typegram';
import {
	IHandlerManager,
	ITelegramBot,
	ITgContext,
	ITgExceptionFilter,
} from './common/telegram-bot.interface';
import { CommonTemplate } from './templates/common-template';

const REQUIRED_ENV_VARS = [
	'DATABASE_URL',
	'TG_BOT_TOKEN',
	'TG_SESSION_DB',
	'TG_PROVIDER_TOKEN',
	'DADATA_TOKEN',
	'DADATA_SECRET',
];

@injectable()
export class TelegramBot implements ITelegramBot {
	private readonly telegraf: Telegraf<ITgContext>;

	constructor(
		@inject(APP_TOKENS.ConfigService) private readonly configService: IConfigService,
		@inject(APP_TOKENS.LoggerService) private readonly loggerService: ILoggerService,
		@inject(APP_TOKENS.HandlerManager) private readonly handlerManager: IHandlerManager,
		@inject(APP_TOKENS.ExceptionFilter) private readonly exceptionFilter: ITgExceptionFilter,
	) {
		this.configService.check(REQUIRED_ENV_VARS);
		this.loggerService.setPrefix(this.constructor.name);

		const token = this.configService.get('TG_BOT_TOKEN');
		const sessionDatabase = this.configService.get('TG_SESSION_DB');

		this.telegraf = new Telegraf<ITgContext>(token);
		this.telegraf.use(new LocalSession({ database: `${sessionDatabase}.session_db.json` }));
		this.telegraf.use(this.handlerManager.middleware());
		this.telegraf.catch(this.exceptionFilter.catch.bind(this.exceptionFilter));
		this.telegraf.on('message', (ctx) => {
			ctx.reply(CommonTemplate.getUndefinedCommand());
		});
	}

	async run(): Promise<void> {
		await this.initCommands();
		return this.telegraf.launch();
	}

	stop(): void {
		this.telegraf.stop();
	}

	private async initCommands(): Promise<void> {
		const commands = await this.telegraf.telegram.getMyCommands();
		if (this.hasCommandDifference(commands, TELEGRAM_BOT_COMMANDS)) {
			await this.telegraf.telegram.deleteMyCommands();
			await this.telegraf.telegram.setMyCommands(TELEGRAM_BOT_COMMANDS);
			this.loggerService.log('Command list was successfully changed');
		}
	}

	private hasCommandDifference(commands: BotCommand[], otherCommands: BotCommand[]): boolean {
		if (commands.length !== otherCommands.length) {
			return true;
		}

		for (const command of commands) {
			const foundCommand = otherCommands.find(
				(other) => other.command === command.command && other.description === command.description,
			);

			if (!foundCommand) {
				return true;
			}
		}

		return false;
	}
}
