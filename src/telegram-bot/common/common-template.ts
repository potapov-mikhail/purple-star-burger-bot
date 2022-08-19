import { TELEGRAM_BOT_COMMANDS } from '../telegram-bot-commands-list';

export abstract class CommonTemlate {
	static getWelcomeGreeting(name: string): string {
		return `👋Добро пожаловать ${name}!\nПроголодались? Мы готовы вас накорить!`;
	}

	static getAddressRequest(): string {
		return `🏠Введите пожалуйста свой адрес, чтобы мы проверили возможность доставки.`;
	}

	static getComebackGreeting(name: string): string {
		return `👋С возвращением ${name}!\nПроголодались? Мы готовы вас накорить!`;
	}

	static getHelp(): string {
		return TELEGRAM_BOT_COMMANDS.map(
			(command) => `/${command.command} - ${command.description}`,
		).join('\n');
	}
}
