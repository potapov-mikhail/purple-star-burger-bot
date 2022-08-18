export interface ITelegramBotGlobalErrorHandler {
	handleError(error: unknown): Promise<void>;
}
