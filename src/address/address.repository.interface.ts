import { PrismaClient } from '@prisma/client';
import { IBaseRepository } from '../common/repository/base-repository.interface';

export type AddressPrismaModel = PrismaClient['address'];
export type IAddressRepository = IBaseRepository<AddressPrismaModel>;
