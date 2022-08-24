import { Container } from 'inversify';
import { IApplication } from './app.interface';
import { APP_TOKENS } from '../container/tokens';
import { DI_APP_BINDINGS } from '../container/container';

export function createApplication(): IApplication {
	const container = new Container();
	container.load(DI_APP_BINDINGS);
	return container.get<IApplication>(APP_TOKENS.Application);
}
