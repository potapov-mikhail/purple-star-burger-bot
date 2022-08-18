import { inject, injectable } from 'inversify';
import { plainToClass } from 'class-transformer';
import { TG_BOT_TOKENS } from '../di/tokens';
import { ProfileScene } from './profile-actions';
import { APP_TOKENS } from '../../common/di/tokens';
import { SceneContext } from 'telegraf/typings/scenes';
import { CommonTemlate } from '../common/common-template';
import { ProfileReplyService } from './profile-reply-service';
import { ICityService } from '../../city/city.service.interface';
import { IUserService } from '../../user/user.service.interface';
import { CreateAddressDto } from '../../address/dto/create-address-dto';
import { IAddressService } from '../../address/address.service.interface';
import { TelegramBotMatchedContext } from '../core/telegram-bot-context.interface';
import { TelegramBotSceneHandler } from '../core/telegram-bot-scene-handler/telegram-bot-scene-handler';

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
		@inject(APP_TOKENS.CityService) private cityService: ICityService,
		@inject(APP_TOKENS.UserService) private userService: IUserService,
		@inject(APP_TOKENS.AddressService) private addressService: IAddressService,
		@inject(TG_BOT_TOKENS.ProfileReplyService) private profileReplyService: ProfileReplyService,
	) {
		super(ProfileScene.AddAddress);
		this.initScenarios();

		this.scene.enter((ctx) => {
			this.setState<IAddressEditoState>(ctx, this.getInitialState());
			const scenario = this.scenario.get(1);

			if (scenario) {
				ctx.reply(scenario.question);
			}
		});

		this.scene.hears(ProfileScene.AddAddresCancel, async (ctx) => {
			await ctx.reply('Вы покинули форму ввода адреса', {
				reply_markup: {
					remove_keyboard: true,
				},
			});
			await ctx.scene.leave();
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
				await ctx.reply(error, {
					reply_markup: {
						keyboard: [[{ text: ProfileScene.AddAddresCancel }]],
					},
				});
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

				await ctx.reply('🔥 Огонь! Мы доставляем по вашему адресу');
				await ctx.reply(CommonTemlate.getHelp());
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
}
