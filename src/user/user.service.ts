import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../common/di/tokens';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserService } from './user.service.interface';
import { IUserRepository } from './user.repository.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(DI_APP_TOKENS.UserRepository) private userRepository: IUserRepository) {}

	findByTgId(tgId: number): Promise<User | null> {
		return this.userRepository.findUnique({ where: { tgId } });
	}

	create(user: CreateUserDto): Promise<User> {
		return this.userRepository.create({ data: user });
	}
}
