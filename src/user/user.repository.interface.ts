import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export type FindOneUserFilter = Pick<User, 'id'> | Pick<User, 'tgId'>;

export interface IUserRepository {
	findOneBy(filter: FindOneUserFilter): Promise<User | null>;
	create(user: CreateUserDto): Promise<User>;
}
