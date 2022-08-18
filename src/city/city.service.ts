import { City } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../common/di/tokens';
import { ICityService } from './city.service.interface';
import { ICityRepository } from './city.repository.interface';

@injectable()
export class CityService implements ICityService {
	constructor(@inject(APP_TOKENS.CityRepository) private cityRepository: ICityRepository) {}

	findAll(): Promise<City[]> {
		return this.cityRepository.findMany({});
	}

	findByName(name: string): Promise<City | null> {
		return this.cityRepository.findFirst({
			where: { name: { equals: name, mode: 'insensitive' } },
		});
	}
}
