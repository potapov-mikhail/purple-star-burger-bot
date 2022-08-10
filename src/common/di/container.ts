import { ContainerModule, interfaces } from 'inversify';
import { DI_APP_TOKENS } from '../di/tokens';
import { UserRepository } from '../../user/user.repository';
import { IUserRepository } from '../../user/user.repository.interface';
import { IUserService } from '../../user/user.service.interface';
import { UserService } from '../../user/user.service';
import { IProductRepository } from '../../product/product.repository.interface';
import { IProductService } from '../../product/product.service.interface';
import { ProductRepository } from '../../product/product.repository';
import { ProductService } from '../../product/product.service';

export const DI_APP_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUserRepository>(DI_APP_TOKENS.UserRepository).to(UserRepository).inSingletonScope();
	bind<IUserService>(DI_APP_TOKENS.UserService).to(UserService).inSingletonScope();

	bind<IProductRepository>(DI_APP_TOKENS.ProductRepository)
		.to(ProductRepository)
		.inSingletonScope();
	bind<IProductService>(DI_APP_TOKENS.ProductService).to(ProductService).inSingletonScope();
});
