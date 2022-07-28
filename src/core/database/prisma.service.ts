import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_TOKENS } from '../di/tokens';
import { ILoggerService } from '../logger/logger.interface';
import { IPrismaService } from '../database/prisma.interface';
import 'reflect-metadata';

@injectable()
export class PrismaService implements IPrismaService {
	readonly client: PrismaClient;

	constructor(@inject(DI_TOKENS.LoggerService) private readonly loggerService: ILoggerService) {
		this.client = new PrismaClient();
		this.loggerService.setPrefix(this.constructor.name);
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('Successfully connected to the database');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error('Error connecting to database: ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.loggerService.error('Successfully disconnected from the database');
	}
}
