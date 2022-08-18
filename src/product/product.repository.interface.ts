import { PrismaClient } from '@prisma/client';
import { IBaseRepository } from '../common/repository/base-repository.interface';

export type ProductPrismaModel = PrismaClient['product'];
export type IProductRepository = IBaseRepository<ProductPrismaModel>;
