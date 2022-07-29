import { injectable } from 'inversify';
import { Logger } from 'tslog';
import { ELogLevel, ILoggerService } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILoggerService {
	private readonly logger: Logger;
	private readonly supportedLogLevels: string[] = [
		ELogLevel.error,
		ELogLevel.warn,
		ELogLevel.info,
		ELogLevel.debug,
	];

	constructor() {
		this.logger = new Logger({
			minLevel: this.getLogLevel(),
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}

	setPrefix(ctx?: string): void {
		this.logger.setSettings({
			prefix: ctx ? [`[${ctx}]`] : undefined,
		});
	}

	private getLogLevel(): ELogLevel {
		const lvl = process.env['DEBUG_LEVEL'] as ELogLevel;

		if (this.supportedLogLevels.includes(lvl)) {
			return lvl;
		}

		return ELogLevel.error;
	}
}
