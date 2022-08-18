import { PrismaClient } from '@prisma/client';
import { IBaseRepository } from '../common/repository/base-repository.interface';

export type OrderPrismaModel = PrismaClient['order'];
export type IOrderRepository = IBaseRepository<OrderPrismaModel>;
