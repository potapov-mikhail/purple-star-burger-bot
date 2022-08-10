import { Container } from 'inversify';
import { DI_TOKENS } from '../core/di/tokens';
import { DI_BINDINGS } from '../core/di/container';
import { IApplication } from './app.interface';
import { DI_APP_BINDINGS } from '../common/di/container';

export function createApplication(): IApplication {
	const container = new Container();
	container.load(DI_BINDINGS);
	container.load(DI_APP_BINDINGS);
	return container.get<IApplication>(DI_TOKENS.Application);
}
