export interface ITelegramBot {
	run(): Promise<void>;
	stop(): void;
}
