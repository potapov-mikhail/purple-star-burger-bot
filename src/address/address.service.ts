import { Address } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { IAddressRepository } from './address.repository.interface';
import { IAddressService } from './address.service.interface';

@injectable()
export class AddressService implements IAddressService {
	constructor(
		@inject(DI_APP_TOKENS.AddressRepository) private addressRepository: IAddressRepository,
	) {}

	findById(id: number): Promise<Address | null> {
		return this.addressRepository.findOneBy({ id });
	}

	findAllByUserId(userId: number): Promise<Address[]> {
		return this.addressRepository.find({ where: { userId: userId } });
	}
}
