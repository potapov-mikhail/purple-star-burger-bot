import { Address } from '@prisma/client';
import { CreateAddressDto } from './dto/create-address-dto';

export interface IAddressService {
	findById(id: number): Promise<Address | null>;
	findAllByUserId(userId: number): Promise<Address[]>;
	create(dto: CreateAddressDto): Promise<Address>;
}
