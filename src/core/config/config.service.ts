import { inject, injectable } from 'inversify';
import { DotenvParseOutput, config, DotenvConfigOutput } from 'dotenv';
import { DI_TOKENS } from '../di/tokens';
import { ILoggerService } from '../logger/logger.interface';
import { IConfigService } from '../config/config.interface';
import 'reflect-metadata';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(DI_TOKENS.LoggerService) private readonly loggerService: ILoggerService) {
		this.loggerService.setPrefix(this.constructor.name);
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.loggerService.error('Failed to read .env file or is missing');
		} else {
			this.loggerService.log('Successfully read .env file');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
