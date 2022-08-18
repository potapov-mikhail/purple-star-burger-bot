import { PrismaClient } from '@prisma/client';
import { IBaseRepository } from '../common/repository/base-repository.interface';

export type UserPrismaModel = PrismaClient['user'];
export type IUserRepository = IBaseRepository<UserPrismaModel>;
