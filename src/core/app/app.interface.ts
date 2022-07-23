export interface IApplication {
	init(): Promise<void>;
	close(signal?: string): Promise<void>;
}
