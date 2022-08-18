import { PrismaClient } from '@prisma/client';
import { IBaseRepository } from '../common/repository/base-repository.interface';

export type CityPrismaModel = PrismaClient['city'];
export type ICityRepository = IBaseRepository<CityPrismaModel>;
