import { Prisma, City } from '@prisma/client';

export type FindOneCityFilter = Pick<City, 'id'> | Pick<City, 'name'>;

export interface ICityRepository {
	find(args?: Prisma.CityFindManyArgs): Promise<City[]>;
	findOneBy(filter: Prisma.CityFindFirstArgs): Promise<City | null>;
}
