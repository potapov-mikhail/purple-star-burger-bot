import { ContainerModule, interfaces } from 'inversify';
import { APP_TOKENS } from './tokens';
import { Application } from '../../app/app';
import { UserService } from '../../user/user.service';
import { CityService } from '../../city/city.service';
import { IApplication } from '../../app/app.interface';
import { OrderService } from '../../order/order.service';
import { UserRepository } from '../../user/user.repository';
import { CityRepository } from '../../city/city.repository';
import { OrderRepository } from '../../order/order.repository';
import { AddressService } from '../../address/address.service';
import { ProductService } from '../../product/product.service';
import { ICityService } from '../../city/city.service.interface';
import { IUserService } from '../../user/user.service.interface';
import { IOrderService } from '../../order/order.service.interface';
import { AddressRepository } from '../../address/address.repository';
import { ProductRepository } from '../../product/product.repository';
import { ICityRepository } from '../../city/city.repository.interface';
import { IUserRepository } from '../../user/user.repository.interface';
import { IAddressService } from '../../address/address.service.interface';
import { IOrderRepository } from '../../order/order.repository.interface';
import { IProductService } from '../../product/product.service.interface';
import { IAddressRepository } from '../../address/address.repository.interface';
import { IProductRepository } from '../../product/product.repository.interface';

export const DI_APP_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<IApplication>(APP_TOKENS.Application).to(Application);

	bind<IUserRepository>(APP_TOKENS.UserRepository).to(UserRepository).inSingletonScope();
	bind<IUserService>(APP_TOKENS.UserService).to(UserService).inSingletonScope();

	bind<ICityRepository>(APP_TOKENS.CityRepository).to(CityRepository).inSingletonScope();
	bind<ICityService>(APP_TOKENS.CityService).to(CityService).inSingletonScope();

	bind<IProductRepository>(APP_TOKENS.ProductRepository).to(ProductRepository).inSingletonScope();
	bind<IProductService>(APP_TOKENS.ProductService).to(ProductService).inSingletonScope();

	bind<IAddressRepository>(APP_TOKENS.AddressRepository).to(AddressRepository).inSingletonScope();
	bind<IAddressService>(APP_TOKENS.AddressService).to(AddressService).inSingletonScope();

	bind<IOrderRepository>(APP_TOKENS.OrderRepository).to(OrderRepository).inSingletonScope();
	bind<IOrderService>(APP_TOKENS.OrderService).to(OrderService).inSingletonScope();
});
