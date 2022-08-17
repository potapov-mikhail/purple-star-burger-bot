import { Address } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IAddressRepository } from './address.repository.interface';
import { IAddressService } from './address.service.interface';
import { CreateAddressDto } from './dto/create-address-dto';

@injectable()
export class AddressService implements IAddressService {
	constructor(
		@inject(DI_APP_TOKENS.AddressRepository) private addressRepository: IAddressRepository,
	) {}

	create(dto: CreateAddressDto): Promise<Address> {
		return this.addressRepository.create(dto);
	}

	findById(id: number): Promise<Address | null> {
		return this.addressRepository.findOneBy({ id });
	}

	findAllByUserId(userId: number): Promise<Address[]> {
		return this.addressRepository.find({ where: { userId: userId } });
	}
}
