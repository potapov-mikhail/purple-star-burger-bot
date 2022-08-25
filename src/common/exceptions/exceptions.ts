export class Exception extends Error {
	context?: string;

	constructor(message: string, context?: string) {
		super(message);
		this.message = message;
		this.context = context;
	}
}

export class NotFoundException extends Exception {
	constructor(context?: string) {
		super('Not Found', context);
	}
}

export class ConflictException extends Exception {
	constructor(context?: string) {
		super('Conflict', context);
	}
}
