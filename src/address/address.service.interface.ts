import { Address } from '@prisma/client';

export interface IAddressService {
	findById(id: number): Promise<Address | null>;
	findAllByUserId(userId: number): Promise<Address[]>;
}
