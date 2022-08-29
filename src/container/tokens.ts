export const APP_TOKENS = {
	LoggerService: Symbol.for('LoggerService'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),

	Application: Symbol.for('Application'),
	UserService: Symbol.for('UserService'),
	ProductService: Symbol.for('ProductService'),
	OrderService: Symbol.for('OrderService'),
	DaDataService: Symbol.for('DaDataService'),

	TelegramBot: Symbol.for('TelegramBot'),
	HandlerManager: Symbol.for('HandlerManager'),
	CommonHandler: Symbol.for('CommonHandler'),
	CatalogHandler: Symbol.for('CatalogHandler'),
	ProfileHandler: Symbol.for('ProfileHandler'),
	CartHandler: Symbol.for('CartHandler'),
	AddAddressScene: Symbol.for('AddAddressScene'),
	ProfileService: Symbol.for('ProfileService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	TgCartService: Symbol.for('TgCartService'),
};
