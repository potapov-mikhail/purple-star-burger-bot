interface IBaseRepositoryMethods {
	findUnique: any;
	findFirst: any;
	findMany: any;
	create: any;
	createMany: any;
	delete: any;
	update: any;
	deleteMany: any;
	updateMany: any;
	count: any;
}

export class BaseRepository<Model extends IBaseRepositoryMethods> {
	constructor(public model: Model) {}

	create(args: Parameters<Model['create']>[0]): ReturnType<Model['create']> {
		return this.model.create(args);
	}

	findUnique(args: Parameters<Model['findUnique']>[0]): ReturnType<Model['findUnique']> {
		return this.model.findUnique(args);
	}

	findFirst(args: Parameters<Model['findFirst']>[0]): ReturnType<Model['findFirst']> {
		return this.model.findFirst(args);
	}

	findMany(args: Parameters<Model['findMany']>[0]): ReturnType<Model['findMany']> {
		return this.model.findMany(args);
	}

	createMany(args: Parameters<Model['createMany']>[0]): ReturnType<Model['createMany']> {
		return this.model.createMany(args);
	}

	delete(args: Parameters<Model['delete']>[0]): ReturnType<Model['delete']> {
		return this.model.delete(args);
	}

	update(args: Parameters<Model['update']>[0]): ReturnType<Model['update']> {
		return this.model.update(args);
	}

	deleteMany(args: Parameters<Model['deleteMany']>[0]): ReturnType<Model['deleteMany']> {
		return this.model.deleteMany(args);
	}

	updateMany(args: Parameters<Model['updateMany']>[0]): ReturnType<Model['updateMany']> {
		return this.model.updateMany(args);
	}

	count(args: Parameters<Model['count']>[0]): ReturnType<Model['count']> {
		return this.model.count(args);
	}
}

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepo extends BaseRepository<typeof prisma.user> {
	constructor() {
		super(null as any);
	}
}
