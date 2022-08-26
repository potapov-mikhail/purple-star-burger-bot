import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DotenvParseOutput, config, DotenvConfigOutput } from 'dotenv';
import { APP_TOKENS } from '../../container/tokens';
import { ILoggerService } from '../logger/logger.interface';
import { IConfigService } from './config.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(APP_TOKENS.LoggerService) private readonly loggerService: ILoggerService) {
		this.loggerService.setPrefix(this.constructor.name);
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.loggerService.error('Failed to read .env file or is missing');
			throw result.error;
		} else {
			this.loggerService.log('Successfully read .env file');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}

	check(keys: string[]): void {
		for (const key of keys) {
			if (!this.get(key)) {
				const errorMessage = `${key} not exist in .env`;
				this.loggerService.error(errorMessage);
				throw new Error(errorMessage);
			}
		}

		this.loggerService.log('Successfully check .env file');
	}
}
