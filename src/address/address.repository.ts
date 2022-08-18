import { inject, injectable } from 'inversify';
import { CORE_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { BaseRepository } from '../common/repository/base-repository';
import { AddressPrismaModel, IAddressRepository } from './address.repository.interface';

@injectable()
export class AddressRepository
	extends BaseRepository<AddressPrismaModel>
	implements IAddressRepository
{
	constructor(@inject(CORE_TOKENS.PrismaService) private prismaService: IPrismaService) {
		super(prismaService.client.address);
	}
}
