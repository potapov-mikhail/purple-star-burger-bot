import { Address, User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { UserEntity } from './user.entity';
import { AddressEntity } from '../address/address.entity';
import { IPrismaService } from '../../common/database/prisma.interface';

@injectable()
export class UserService {
	constructor(@inject(APP_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	async getUserByTgId(tgId: number): Promise<User | null> {
		return this.prismaService.client.user.findUnique({ where: { tgId } });
	}

	async getUserAddressesByTgId(tgId: number): Promise<Address[]> {
		return this.prismaService.client.address.findMany({ where: { user: { tgId } } });
	}

	async getUserWithAddress(tgId: number): Promise<(User & { address: Address[] }) | null> {
		return this.prismaService.client.user.findUnique({
			where: { tgId },
			include: { address: true },
		});
	}

	async createUser({ name, tgId }: UserEntity): Promise<User> {
		return this.prismaService.client.user.create({
			data: { name, tgId },
		});
	}

	async createUserAddressByTgId(tgId: number, address: AddressEntity): Promise<Address> {
		const user = await this.prismaService.client.user.findUniqueOrThrow({ where: { tgId } });
		const existAddress = await this.prismaService.client.address.findFirst({
			where: { ...address, userId: user.id },
		});

		if (existAddress) {
			throw new Error('Адрес уже существует');
		}

		return await this.prismaService.client.address.create({
			data: { ...address, userId: user.id },
		});
	}

	async deleteUserAddressByTgId(tgId: number, addressId: number): Promise<any> {
		const user = await this.prismaService.client.user.findUniqueOrThrow({ where: { tgId } });
		const address = await this.prismaService.client.address.findFirstOrThrow({
			where: { id: addressId, userId: user.id },
		});

		return this.prismaService.client.address.delete({ where: { id: address.id } });
	}
}
