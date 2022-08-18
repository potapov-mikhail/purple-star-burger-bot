import { inject, injectable } from 'inversify';
import { DI_TOKENS } from '../core/di/tokens';
import { IPrismaService } from '../core/database/prisma.interface';
import { BaseRepository } from '../common/repository/base-repository';
import { IUserRepository, UserPrismaModel } from './user.repository.interface';

@injectable()
export class UserRepository extends BaseRepository<UserPrismaModel> implements IUserRepository {
	constructor(@inject(DI_TOKENS.PrismaService) private prismaService: IPrismaService) {
		super(prismaService.client.user);
	}
}
