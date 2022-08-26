import { Context, Middleware, Scenes } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export interface ITelegramBot {
	run(): Promise<void>;
	stop(): void;
}

export interface IHandlerManager<C extends ITgContext = ITgContext> {
	middleware(): Middleware<C>;
}

export interface ITgHandler<C extends ITgContext = ITgContext> {
	middleware(): Middleware<C>;
}

export interface ITgExceptionFilter {
	catch: (err: unknown, ctx: ITgContext) => void;
}

export interface ITelegramBotExtraView {
	template: string;
	extra: ExtraReplyMessage;
}

export interface ITgContext extends Context {
	session: Scenes.SceneSession<Scenes.SceneSessionData>;
	scene: Scenes.SceneContextScene<ITgContext, Scenes.SceneSessionData>;
}
