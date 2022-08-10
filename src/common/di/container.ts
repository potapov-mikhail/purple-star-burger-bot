import { ContainerModule, interfaces } from 'inversify';
import { DI_APP_TOKENS } from '../di/tokens';
import { UserRepository } from '../../user/user.repository';
import { IUserRepository } from '../../user/user.repository.interface';
import { IUserService } from '../../user/user.service.interface';
import { UserService } from '../../user/user.service';

export const DI_APP_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUserRepository>(DI_APP_TOKENS.UserRepository).to(UserRepository).inSingletonScope();
	bind<IUserService>(DI_APP_TOKENS.UserService).to(UserService).inSingletonScope();
});
