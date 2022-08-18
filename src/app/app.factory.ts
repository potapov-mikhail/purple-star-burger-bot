import { Container } from 'inversify';
import { IApplication } from './app.interface';
import { APP_TOKENS } from '../common/di/tokens';
import { DI_CORE_BINDINGS } from '../core/di/container';
import { DI_APP_BINDINGS } from '../common/di/container';
import { DI_TG_BOT_BINDINGS } from '../telegram-bot/di/container';

export function createApplication(): IApplication {
	const container = new Container();
	container.load(DI_CORE_BINDINGS);
	container.load(DI_APP_BINDINGS);
	container.load(DI_TG_BOT_BINDINGS);

	return container.get<IApplication>(APP_TOKENS.Application);
}
