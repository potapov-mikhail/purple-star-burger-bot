import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_USERS: Pick<User, 'name' | 'tgId'>[] = [
	{ name: 'Mikhail', tgId: 1 },
	{ name: 'Dmitry', tgId: 2 },
];

async function main(): Promise<void> {
	await prisma.$connect();
	await prisma.user.createMany({
		data: DEFAULT_USERS,
	});

	await prisma.$disconnect();
}

main().then(() => {
	console.log('Seeding your database was success');
});
