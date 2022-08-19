import { Context, NarrowedContext } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { SessionContext } from 'telegraf/typings/session';
import { MessageSubType, MountMap, UpdateType } from 'telegraf/typings/telegram-types';

export type TelegramBotMatchedContext<
	C extends Context,
	T extends UpdateType | MessageSubType,
> = NarrowedContext<C, MountMap[T]>;

export type TelegramBotCommandContext<S extends object = object> = TelegramBotMatchedContext<
	SessionContext<S>,
	'text'
>;

export type TelegramBotHeartContext<S extends object = object> = TelegramBotMatchedContext<
	SessionContext<S> & { match: RegExpExecArray },
	'text'
>;

export type TelegramBotActionContext<S extends object = object> = TelegramBotMatchedContext<
	SessionContext<S> & { match: RegExpExecArray },
	'callback_query'
>;

export type TelegramBotScentCtx = SceneContext;
export type TelegramBotTextSceneCtx = TelegramBotMatchedContext<SceneContext, 'text'>;
