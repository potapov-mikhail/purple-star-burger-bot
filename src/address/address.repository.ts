import { inject, injectable } from 'inversify';
import { Address, Prisma } from '@prisma/client';
import { DI_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { FindOneAddressFilter, IAddressRepository } from './address.repository.interface';
import { CreateAddressDto } from './dto/create-address-dto';

@injectable()
export class AddressRepository implements IAddressRepository {
	constructor(@inject(DI_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	create(address: CreateAddressDto): Promise<Address> {
		return this.prismaService.client.address.create({
			data: address,
		});
	}

	find(args?: Prisma.AddressFindManyArgs): Promise<Address[]> {
		return this.prismaService.client.address.findMany(args);
	}

	findOneBy(filter: FindOneAddressFilter): Promise<Address | null> {
		if ('id' in filter) {
			return this.prismaService.client.address.findUnique({ where: { id: filter.id } });
		} else {
			return this.prismaService.client.address.findFirst({ where: filter });
		}
	}
}
