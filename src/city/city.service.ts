import { City } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { ICityRepository } from './city.repository.interface';
import { ICityService } from './city.service.interface';

@injectable()
export class CityService implements ICityService {
	constructor(@inject(DI_APP_TOKENS.CityRepository) private cityRepository: ICityRepository) {}

	findAll(): Promise<City[]> {
		return this.cityRepository.findMany({});
	}

	findByName(name: string): Promise<City | null> {
		return this.cityRepository.findFirst({
			where: { name: { equals: name, mode: 'insensitive' } },
		});
	}
}
