export const DI_APP_TOKENS = {
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),

	ProductService: Symbol.for('ProductService'),
	ProductRepository: Symbol.for('ProductRepository'),

	AddressService: Symbol.for('AddressService'),
	AddressRepository: Symbol.for('AddressRepository'),

	OrderService: Symbol.for('OrderService'),
	OrderRepository: Symbol.for('OrderRepository'),

	ProductTelegramBotController: Symbol.for('ProductTelegramBotController'),
	ProfileTelegramBotController: Symbol.for('ProfileTelegramBotController'),
};
