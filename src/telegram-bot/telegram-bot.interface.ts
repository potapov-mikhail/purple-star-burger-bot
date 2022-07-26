export interface ITelegramBot {
	run(): Promise<void>;
	stop(): Promise<void>;
}
