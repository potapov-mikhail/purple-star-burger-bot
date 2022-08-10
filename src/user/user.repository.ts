import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_TOKENS } from '../core/di/tokens';
import { CreateUserDto } from './dto/create-user.dto';
import { IPrismaService } from '../core/database/prisma.interface';
import { FindOneUserFilter, IUserRepository } from './user.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(DI_TOKENS.PrismaService) private prismaService: IPrismaService) {}

	findOneBy(filter: FindOneUserFilter): Promise<User | null> {
		return this.prismaService.client.user.findUnique({ where: filter });
	}

	create(user: CreateUserDto): Promise<User> {
		return this.prismaService.client.user.create({
			data: user,
		});
	}
}
