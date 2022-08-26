export abstract class CommonTemplate {
	static getWelcomeGreeting(name: string): string {
		return `👋Добро пожаловать ${name}!\nПроголодались? Мы готовы вас накормить!`;
	}

	static getAddressRequest(): string {
		return `🏠Введите пожалуйста свой адрес, чтобы мы проверили возможность доставки.`;
	}

	static getComebackGreeting(name: string): string {
		return `👋С возвращением ${name}!\nПроголодались? Мы готовы вас накормить!`;
	}

	static getUndefinedCommand(): string {
		return '🤔 Хм, это не похоже на команду… Попробуем ещё раз?';
	}
}
