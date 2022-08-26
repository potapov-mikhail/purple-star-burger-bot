export const APP_TOKENS = {
	LoggerService: Symbol.for('LoggerService'),
	ConfigService: Symbol.for('ConfigService'),
	PrismaService: Symbol.for('PrismaService'),

	Application: Symbol.for('Application'),
	UserService: Symbol.for('UserService'),
	ProductService: Symbol.for('ProductService'),
	CatalogService: Symbol.for('CatalogService'),
	DaDataService: Symbol.for('DaDataService'),

	TelegramBot: Symbol.for('TelegramBot'),
	HandlerManager: Symbol.for('HandlerManager'),
	CommonHandler: Symbol.for('CommonHandler'),
	CatalogHandler: Symbol.for('CatalogHandler'),
	ProfileHandler: Symbol.for('ProfileHandler'),
	AddAddressScene: Symbol.for('AddAddressScene'),
	ProfileService: Symbol.for('ProfileService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
};
