import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export interface IUserService {
	findByTgId(id: number): Promise<User | null>;
	create(user: CreateUserDto): Promise<User>;
}
