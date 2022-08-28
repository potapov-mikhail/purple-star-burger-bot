import { BotCommand } from 'telegraf/typings/core/types/typegram';

export const TG_SCENES = {
	AddAddress: 'addaddress',
};

export const TG_TRIGGERS = {
	Start: 'start',
	Profile: 'profile',
	AddAddress: 'addaddress',
	ConfirmAddress: 'onConfirmAddress',
	RejectAddress: 'onRejectAddress',
	BurgerList: 'burgers',
	BurgerCard: { prefix: 'burger', pattern: /burger+[0-9]*/ },
	BurgerChangePage: { prefix: 'onChangeBurgersPage', pattern: /onChangeBurgersPage-+[0-9]*/ },
	DrinkList: 'drinks',
	DrinkCard: { prefix: 'drink', pattern: /drink+[0-9]*/ },
	DrinkChangePage: { prefix: 'onChangeDrinksPage', pattern: /onChangeDrinksPage-+[0-9]*/ },
	Cart: 'cart',
	AddToCart: { prefix: 'onAddToCart', pattern: /onAddToCart+[0-9]*/ },
	DeleteFromCart: { prefix: 'onDeleteFromCart', pattern: /onDeleteFromCart+[0-9]*/ },
};

export const TELEGRAM_BOT_COMMANDS: BotCommand[] = [
	{ command: TG_TRIGGERS.Start, description: 'Запустить бота' },
	{ command: TG_TRIGGERS.BurgerList, description: 'Список бургеров' },
	{ command: TG_TRIGGERS.DrinkList, description: 'Список напитков' },
	{ command: TG_TRIGGERS.Profile, description: 'Карточка профиля' },
	{ command: TG_TRIGGERS.AddAddress, description: 'Добавить новый адрес' },
	{ command: TG_TRIGGERS.Cart, description: 'Корзина' },
];
