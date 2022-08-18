export interface IBaseRepositoryMethods {
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

export interface IBaseRepository<Model extends IBaseRepositoryMethods> {
	model: Model;
	create(args: Parameters<Model['create']>[0]): ReturnType<Model['create']>;
	findUnique(args: Parameters<Model['findUnique']>[0]): ReturnType<Model['findUnique']>;
	findFirst(args: Parameters<Model['findFirst']>[0]): ReturnType<Model['findFirst']>;
	findMany(args: Parameters<Model['findMany']>[0]): ReturnType<Model['findMany']>;
	createMany(args: Parameters<Model['createMany']>[0]): ReturnType<Model['createMany']>;
	delete(args: Parameters<Model['delete']>[0]): ReturnType<Model['delete']>;
	update(args: Parameters<Model['update']>[0]): ReturnType<Model['update']>;
	deleteMany(args: Parameters<Model['deleteMany']>[0]): ReturnType<Model['deleteMany']>;
	updateMany(args: Parameters<Model['updateMany']>[0]): ReturnType<Model['updateMany']>;
	count(args: Parameters<Model['count']>[0]): ReturnType<Model['count']>;
}
