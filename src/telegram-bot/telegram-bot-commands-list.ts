import { BotCommand } from 'telegraf/typings/core/types/typegram';

export const TELEGRAM_BOT_COMMANDS: BotCommand[] = [
	{ command: 'start', description: 'Запустить бота' },
	{ command: 'help', description: 'Список доступных команд' },
	{ command: 'burgers', description: 'Список бургеров' },
	{ command: 'drinks', description: 'Список напитков' },
	{ command: 'profile', description: 'Карточка профиля' },
	{ command: 'addaddress', description: 'Добавить новый адрес' },
];
