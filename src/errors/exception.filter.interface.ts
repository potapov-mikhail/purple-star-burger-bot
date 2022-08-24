import { ITgContext } from '../common/telegram-bot.interface';

export interface IExceptionFilter {
	catch: (err: unknown, ctx: ITgContext) => void;
}
