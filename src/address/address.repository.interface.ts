import { Address, Prisma } from '@prisma/client';
import { CreateAddressDto } from './dto/create-address-dto';

export type FindOneAddressFilter = Pick<Address, 'id'> | Pick<Address, 'city' | 'street'>;
export type FindAddressArgs = Prisma.AddressFindManyArgs;

export interface IAddressRepository {
	find(args?: Prisma.AddressFindManyArgs): Promise<Address[]>;
	findOneBy(filter: FindOneAddressFilter): Promise<Address | null>;
	create(address: CreateAddressDto): Promise<Address>;
}
