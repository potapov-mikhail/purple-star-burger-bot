import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_USERS: Pick<User, 'name'>[] = [{ name: 'Mikhail' }, { name: 'Dmitry' }];

async function main() {
	await prisma.$connect();
	await prisma.user.createMany({
		data: DEFAULT_USERS,
	});

	await prisma.$disconnect();
}

main().then(() => {
	console.log('Seeding your database was success');
});
