import { Address, Prisma } from '@prisma/client';

export type FindOneAddressFilter = Pick<Address, 'id'> | Pick<Address, 'city' | 'street'>;

export interface IAddressRepository {
	find(args?: Prisma.AddressFindManyArgs): Promise<Address[]>;
	findOneBy(filter: FindOneAddressFilter): Promise<Address | null>;
}
