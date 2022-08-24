export interface IConfigService {
	get(key: string): string;
	check(keys: string[]): void | never;
}
