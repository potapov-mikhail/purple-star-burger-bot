import { Address } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { CreateAddressDto } from './dto/create-address-dto';
import { IAddressService } from './address.service.interface';
import { IAddressRepository } from './address.repository.interface';

@injectable()
export class AddressService implements IAddressService {
	constructor(
		@inject(DI_APP_TOKENS.AddressRepository) private addressRepository: IAddressRepository,
	) {}

	create(dto: CreateAddressDto): Promise<Address> {
		return this.addressRepository.create({
			data: dto,
		});
	}

	findById(id: number): Promise<Address | null> {
		return this.addressRepository.findUnique({ where: { id } });
	}

	findAllByUserId(userId: number): Promise<Address[]> {
		return this.addressRepository.findMany({ where: { userId: userId } });
	}
}
