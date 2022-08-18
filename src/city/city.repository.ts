import { inject, injectable } from 'inversify';
import { DI_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { BaseRepository } from '../common/repository/base-repository';
import { CityPrismaModel, ICityRepository } from './city.repository.interface';

@injectable()
export class CityRepository extends BaseRepository<CityPrismaModel> implements ICityRepository {
	constructor(@inject(DI_TOKENS.PrismaService) private prismaService: IPrismaService) {
		super(prismaService.client.city);
	}
}
