import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { ProfileReplyService } from './profile-reply-service';
import { TelegramBotSceneHandler } from '../core/telegram-bot-scene-handler/telegram-bot-scene-handler';
import { TelegramBotStorage } from '../core/telegram-bot-stoage/telegram-bot-storage';
import { ICityService } from '../../city/city.service.interface';

interface IAddressEditoState {
	step: number; // maxStep, key for save data, isEdit or create
	city: string | null;
	street: string | null;
	house: string | null;
}

// Зачем обновление?

// Address Editor
@injectable()
export class AddAddressHandler extends TelegramBotSceneHandler {
	private scenario = new Map([
		[
			1,
			{
				key: 'city',
				question: 'Введите город',
				validation: async (v: string) => {
					const city = await this.cityService.findByName(v);

					return city ? '' : 'Не валидный город';
				},
			},
		],
		[
			2,
			{
				key: 'street',
				question: 'Введите улицу',
				validation: (v: string) =>
					Math.floor(Math.random() * 100) > 50 ? 'Не валидная улица' : '',
			},
		],
		[
			3,
			{
				key: 'house',
				final: true,
				question: 'Введите номер дома',
				validation: (v: string) =>
					Math.floor(Math.random() * 100) > 50 ? 'Не валидный номер дома' : '',
			},
		],
	]);

	constructor(
		@inject(DI_APP_TOKENS.CityService) private cityService: ICityService,
		@inject(DI_APP_TOKENS.ProfileReplyService) private profileReplyService: ProfileReplyService,
		@inject(DI_APP_TOKENS.TelegramBotStorage)
		private telegramBotStorage: TelegramBotStorage,
	) {
		super('addAddress');

		this.scene.enter((ctx) => {
			this.setState<IAddressEditoState>(ctx, this.getInitialState());
			const state = this.getState<IAddressEditoState>(ctx);
			const step = this.scenario.get(Number(state.step))!;
			ctx.reply(step.question);
		});

		this.scene.on('text', async (ctx) => {
			const value = ctx.message.text;
			const state = this.getState<IAddressEditoState>(ctx);
			const step = this.scenario.get(Number(state.step))!;
			const key = step.key;

			const error = await step.validation(value);

			if (error) {
				await ctx.reply(error);
			} else {
				this.setState<IAddressEditoState>(ctx, {
					...state,
					step: Number(state.step) + 1,
					[key]: value,
				});
				const step = this.scenario.get(Number(state.step))!;

				// Не отрабатывает последний шаг
				if (!step.final) {
					await ctx.reply(step.question);
				} else {
					await ctx.reply(`${state.city} ${state.street} ${state.house}`);
					await ctx.scene.leave();
				}
			}
		});
	}

	private getInitialState(): IAddressEditoState {
		return { step: 1, city: null, street: null, house: null };
	}
}
