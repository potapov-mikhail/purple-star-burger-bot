export const DI_APP_TOKENS = {
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),

	CityService: Symbol.for('CityService'),
	CityRepository: Symbol.for('CityRepository'),

	ProductService: Symbol.for('ProductService'),
	ProductRepository: Symbol.for('ProductRepository'),

	AddressService: Symbol.for('AddressService'),
	AddressRepository: Symbol.for('AddressRepository'),

	OrderService: Symbol.for('OrderService'),
	OrderRepository: Symbol.for('OrderRepository'),

	ProductTelegramBotController: Symbol.for('ProductTelegramBotController'),
	ProfileTelegramBotController: Symbol.for('ProfileTelegramBotController'),
	OrderTelegramBotController: Symbol.for('OrderTelegramBotController'),
	AddressTelegramBotController: Symbol.for('AddressTelegramBotController'),

	UpdateAddressHandler: Symbol.for('UpdateAddressHandler'),
	CreateAddressHandler: Symbol.for('CreateAddressHandler'),

	CommandHandler: Symbol.for('CommandHandler'),
	CartHandler: Symbol.for('CartHandler'),
	CatalogHandler: Symbol.for('CatalogHandler'),
	ProfileHandler: Symbol.for('ProfileHandler'),

	ProfileReplyService: Symbol.for('ProfileReplyService'),
	AddAddressHandler: Symbol.for('AddAddressHandler'),

	TelegramBotStorage: Symbol.for('TelegramBotStorage'),
};
