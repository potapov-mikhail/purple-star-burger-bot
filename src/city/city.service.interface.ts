import { City } from '@prisma/client';

export interface ICityService {
	findAll(): Promise<City[]>;
	findByName(name: string): Promise<City | null>;
}
