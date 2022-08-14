export abstract class CommonTemlate {
	static getWelcomeGreeting(name: string): string {
		return `Добро пожаловать ${name}!\nПосмотрите наше меню дня!`;
	}

	static getComebackGreeting(name: string): string {
		return `С возвращением ${name}!\nПосмотрите наше меню дня!`;
	}

	static getHelp(): string {
		return `/burgers - Список бургеров\n/drinks - Список напитков\n/profile - Карточка профиля`;
	}
}
