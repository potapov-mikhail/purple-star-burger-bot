import { inject, injectable } from 'inversify';
import { City, Prisma } from '@prisma/client';
import { DI_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { FindOneCityFilter, ICityRepository } from './city.repository.interface';

@injectable()
export class CityRepository implements ICityRepository {
	constructor(@inject(DI_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	find(args?: Prisma.CityFindManyArgs): Promise<City[]> {
		return this.prismaService.client.city.findMany(args);
	}

	findOneBy(args: Prisma.CityFindFirstArgs): Promise<City | null> {
		return this.prismaService.client.city.findFirst(args);
	}
}
