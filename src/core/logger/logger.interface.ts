export enum ELogLevel {
	error = 'error',
	warn = 'warn',
	info = 'info',
	debug = 'debug',
}
export interface ILoggerService<T = string> {
	setPrefix(ctx: T): void;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
