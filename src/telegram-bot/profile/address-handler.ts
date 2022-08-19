import { Markup } from 'telegraf';
import { inject, injectable } from 'inversify';
import { plainToClass } from 'class-transformer';
import { ProfileScene } from './profile-actions';
import { APP_TOKENS } from '../../common/di/tokens';
import { CommonTemlate } from '../common/common-template';
import { ICityService } from '../../city/city.service.interface';
import { IUserService } from '../../user/user.service.interface';
import { CreateAddressDto } from '../../address/dto/create-address-dto';
import { IAddressService } from '../../address/address.service.interface';
import {
	TelegramBotScentCtx,
	TelegramBotTextSceneCtx,
} from '../core/telegram-bot-context.interface';
import { TelegramBotSceneHandler } from '../core/telegram-bot-scene-handler/telegram-bot-scene-handler';

interface IAddAddressState {
	step: number;
	city?: string;
	street?: string;
	house?: string;
}

interface IAddAddressScenarioStep {
	key: string;
	question: string;
	validation?: (value: string) => Promise<string | null>;
}

@injectable()
export class AddAddressHandler extends TelegramBotSceneHandler {
	private scenario = new Map<number, IAddAddressScenarioStep>();

	constructor(
		@inject(APP_TOKENS.CityService) private cityService: ICityService,
		@inject(APP_TOKENS.UserService) private userService: IUserService,
		@inject(APP_TOKENS.AddressService) private addressService: IAddressService,
	) {
		super(ProfileScene.AddAddress);
		this.initScenarios();

		this.bindHears([
			{
				name: ProfileScene.AddAddresCancel,
				handler: this.cancel.bind(this),
			},
		]);
		this.bindEnterHanders(this.onEnter.bind(this));
		this.bindTextHander(this.handleScenario.bind(this));
	}

	private async onEnter(ctx: TelegramBotScentCtx): Promise<void> {
		this.setState<IAddAddressState>(ctx, this.getInitialState());
		const scenario = this.scenario.get(1);

		if (scenario) {
			await this.replyTextWithCancelMarkup(ctx, scenario.question);
		} else {
			await this.leave(ctx);
		}
	}

	private async cancel(ctx: TelegramBotScentCtx): Promise<void> {
		await this.removeKeyBoard(ctx, '☹️ Вы покинули форму ввода адреса');
		await this.leave(ctx);
	}

	private async handleScenario(ctx: TelegramBotTextSceneCtx): Promise<void> {
		const answer = ctx.message.text;
		const state = this.getState<IAddAddressState>(ctx);
		const currentScenario = this.scenario.get(state?.step || -1);

		if (!state || !currentScenario) {
			this.leave(ctx);
			return;
		}

		if (currentScenario.validation) {
			const error = await currentScenario.validation(answer);

			if (error) {
				await this.replyTextWithCancelMarkup(ctx, error);
				return;
			}
		}

		const nextStep = state.step + 1;
		const nextScenario = this.scenario.get(nextStep);
		this.patchState<IAddAddressState>(ctx, { [currentScenario.key]: answer, step: nextStep });

		if (nextScenario) {
			await this.replyTextWithCancelMarkup(ctx, nextScenario.question);
		} else {
			const { city, street, house } = state;

			if (city && street && house) {
				await this.createAddress(ctx.from.id, {
					city,
					street,
					house,
				});

				await ctx.reply('🔥 Огонь! Мы доставляем по вашему адресу');
				await ctx.reply(CommonTemlate.getHelp());
				await this.leave(ctx);
			} else {
				await ctx.reply('Что то пошло не так попробуйте еще раз');
				await this.leave(ctx);
			}
		}
	}

	private async createAddress(
		tgId: number,
		addressParams: { city: string; street: string; house: string },
	): Promise<void> {
		const user = await this.userService.findByTgId(tgId);

		if (!user) {
			throw new Error('A user is required to create an address');
		}

		const address = plainToClass(CreateAddressDto, {
			userId: user.id,
			city: addressParams.city,
			street: addressParams.street,
			house: addressParams.house,
		});

		await this.addressService.create(address);
	}

	private async replyTextWithCancelMarkup(ctx: TelegramBotScentCtx, text: string): Promise<void> {
		const markup = Markup.keyboard([[{ text: ProfileScene.AddAddresCancel }]]).resize();
		await ctx.reply(text, markup);
	}

	private initScenarios(): void {
		this.scenario.set(1, {
			key: 'city',
			question: 'Введите город',
			validation: async (value: string) => {
				const city = await this.cityService.findByName(value);
				return city
					? null
					: '😞 К сожалению, мы пока к вам не доставляем, но, надеемся, совсем скоро расширим зону. Вы можете ввести другой город или покинуть форму.';
			},
		});

		this.scenario.set(2, {
			key: 'street',
			question: 'Введите улицу',
			validation: async (value: string) => {
				return value.length > 2
					? null
					: '🤔 Название улицы не может содержать меньше двух символов.';
			},
		});

		this.scenario.set(3, {
			key: 'house',
			question: 'Введите номер дома',
		});
	}

	private getInitialState(): IAddAddressState {
		return { step: 1 };
	}
}
