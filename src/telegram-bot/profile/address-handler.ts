import { inject, injectable } from 'inversify';
import { DI_APP_TOKENS } from '../../common/di/tokens';
import { ProfileReplyService } from './profile-reply-service';
import { TelegramBotSceneHandler } from '../core/telegram-bot-scene-handler/telegram-bot-scene-handler';
import { ICityService } from '../../city/city.service.interface';
import { SceneContext } from 'telegraf/typings/scenes';
import { IUserService } from '../../user/user.service.interface';
import { IAddressService } from '../../address/address.service.interface';
import { CreateAddressDto } from '../../address/dto/create-address-dto';
import { plainToClass } from 'class-transformer';
import { TelegramBotMatchedContext } from '../core/telegram-bot-context.interface';

interface IAddressEditoState {
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
		@inject(DI_APP_TOKENS.CityService) private cityService: ICityService,
		@inject(DI_APP_TOKENS.UserService) private userService: IUserService,
		@inject(DI_APP_TOKENS.AddressService) private addressService: IAddressService,
		@inject(DI_APP_TOKENS.ProfileReplyService) private profileReplyService: ProfileReplyService,
	) {
		super('addAddress');
		this.initScenarios();

		this.scene.enter((ctx) => {
			this.setState<IAddressEditoState>(ctx, this.getInitialState());
			const scenario = this.scenario.get(1);

			if (scenario) {
				ctx.reply(scenario.question);
			}
		});

		this.scene.on('text', async (ctx) => {
			this.handleScenario(ctx);
		});
	}

	private getInitialState(): IAddressEditoState {
		return { step: 1 };
	}

	private async handleScenario(
		ctx: TelegramBotMatchedContext<SceneContext, 'text'>,
	): Promise<void> {
		const answer = ctx.message.text;
		const state = this.getState<IAddressEditoState>(ctx);
		const currentScenario = this.scenario.get(state.step);

		if (!currentScenario) {
			// Что то пошло не так, логируем
			ctx.scene.leave();
			return;
		}

		if (currentScenario.validation) {
			const error = await currentScenario.validation(answer);
			if (error) {
				await ctx.reply(error);
				return;
			}
		}

		const nextStep = state.step + 1;
		const nextScenario = this.scenario.get(nextStep);
		this.patchState<IAddressEditoState>(ctx, { [currentScenario.key]: answer, step: nextStep });

		if (nextScenario) {
			await ctx.reply(nextScenario.question);
		} else {
			const { city, street, house } = state;

			if (city && street && house) {
				await this.createAddress(ctx.from.id, {
					city,
					street,
					house,
				});

				this.profileReplyService.showProfileCard(ctx, ctx.from.id);
				await ctx.scene.leave();
			} else {
				ctx.reply('Что то пошло не так попробуйте еще раз');
			}
		}
	}

	private async createAddress(
		tgId: number,
		addressParams: { city: string; street: string; house: string },
	): Promise<void> {
		const user = await this.userService.findByTgId(tgId);

		if (user) {
			const address = plainToClass(CreateAddressDto, {
				userId: user.id,
				city: addressParams.city,
				street: addressParams.street,
				house: addressParams.house,
			});

			await this.addressService.create(address);
		}
	}

	private initScenarios(): void {
		this.scenario.set(1, {
			key: 'city',
			question: 'Введите город',
			validation: async (value: string) => {
				const city = await this.cityService.findByName(value);
				return city
					? null
					: '😞 К сожалению, мы пока к вам не доставляем, но, надеемся, совсем скоро расширим зону.';
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
}
