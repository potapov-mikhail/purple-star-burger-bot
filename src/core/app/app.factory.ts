import { Container } from 'inversify';
import { DI_TOKENS } from '../di/tokens';
import { DI_BINDINGS } from '../di/container';
import { IApplication } from './app.interface';

export function createApplication(): IApplication {
	const appContainer = new Container();
	appContainer.load(DI_BINDINGS);
	return appContainer.get<IApplication>(DI_TOKENS.Application);
}
