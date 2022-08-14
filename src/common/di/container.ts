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
import { IAddressRepository } from '../../address/address.repository.interface';
import { AddressRepository } from '../../address/address.repository';
import { IAddressService } from '../../address/address.service.interface';
import { AddressService } from '../../address/address.service';
import { IOrderRepository } from '../../order/order.repository.interface';
import { IOrderService } from '../../order/order.service.interface';
import { OrderRepository } from '../../order/order.repository';
import { OrderService } from '../../order/order.service';
import { CatalogReplyService } from '../../telegram-bot/catalog/catalog-reply-service';

import { CommonHandler } from '../../telegram-bot/common/common-handler';
import { CartHandler } from '../../telegram-bot/cart/cart-handler';
import { CatalogHandler } from '../../telegram-bot/catalog/catalog-handler';
import { ProfileHandler } from '../../telegram-bot/profile/profile-handler';
import { ProfileReplyService } from '../../telegram-bot/profile/profile-reply-service';
import { AddAddressHandler } from '../../telegram-bot/profile/address-handler';
import { ITelegramBotStorage } from '../../telegram-bot/core/telegram-bot-stoage/telegram-bot-storage.interface';
import { TelegramBotStorage } from '../../telegram-bot/core/telegram-bot-stoage/telegram-bot-storage';
import { ICityRepository } from '../../city/city.repository.interface';
import { CityRepository } from '../../city/city.repository';
import { ICityService } from '../../city/city.service.interface';
import { CityService } from '../../city/city.service';

export const DI_APP_BINDINGS = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUserRepository>(DI_APP_TOKENS.UserRepository).to(UserRepository).inSingletonScope();
	bind<IUserService>(DI_APP_TOKENS.UserService).to(UserService).inSingletonScope();

	bind<ICityRepository>(DI_APP_TOKENS.CityRepository).to(CityRepository).inSingletonScope();
	bind<ICityService>(DI_APP_TOKENS.CityService).to(CityService).inSingletonScope();

	bind<IProductRepository>(DI_APP_TOKENS.ProductRepository)
		.to(ProductRepository)
		.inSingletonScope();
	bind<IProductService>(DI_APP_TOKENS.ProductService).to(ProductService).inSingletonScope();

	bind<IAddressRepository>(DI_APP_TOKENS.AddressRepository)
		.to(AddressRepository)
		.inSingletonScope();
	bind<IAddressService>(DI_APP_TOKENS.AddressService).to(AddressService).inSingletonScope();

	bind<IOrderRepository>(DI_APP_TOKENS.OrderRepository).to(OrderRepository).inSingletonScope();
	bind<IOrderService>(DI_APP_TOKENS.OrderService).to(OrderService).inSingletonScope();

	bind<CatalogReplyService>(DI_APP_TOKENS.ProductTelegramBotController)
		.to(CatalogReplyService)
		.inSingletonScope();

	bind<CommonHandler>(DI_APP_TOKENS.CommandHandler).to(CommonHandler).inSingletonScope();
	bind<CartHandler>(DI_APP_TOKENS.CartHandler).to(CartHandler).inSingletonScope();
	bind<CatalogHandler>(DI_APP_TOKENS.CatalogHandler).to(CatalogHandler).inSingletonScope();
	bind<ProfileHandler>(DI_APP_TOKENS.ProfileHandler).to(ProfileHandler).inSingletonScope();

	bind<ProfileReplyService>(DI_APP_TOKENS.ProfileReplyService)
		.to(ProfileReplyService)
		.inSingletonScope();

	bind<AddAddressHandler>(DI_APP_TOKENS.AddAddressHandler).to(AddAddressHandler).inSingletonScope();
	bind<ITelegramBotStorage>(DI_APP_TOKENS.TelegramBotStorage)
		.to(TelegramBotStorage)
		.inSingletonScope();
});
