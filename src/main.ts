import { createApplication } from './app/app.factory';

async function bootstrap(): Promise<void> {
	const app = createApplication();
	await app.init();

	process.on('exit', async () => {
		await app.close();
	});
}

bootstrap();
