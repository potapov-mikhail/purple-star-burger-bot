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
		return `/burgers - Список бургеров\n/drinks - Список напитков\n/profile - Карточка профиля\n/addAddress - Добавить новый адрес`;
	}
}
