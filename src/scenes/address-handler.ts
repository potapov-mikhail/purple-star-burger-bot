import { Markup } from 'telegraf';
import { inject, injectable } from 'inversify';
import { TelegramBotSceneHandler } from '../common/telegram-bot-scene-handler/telegram-bot-scene-handler';
import { APP_TOKENS } from '../container/tokens';
import { DaDataService } from '../services/dadata.service';
import { UserService } from '../services/user.service';
import { TG_SCENES } from '../telegram-bot/telegram-bot-triggers';
import { CommonTemplate } from '../templates/common-template';
import { ITgContext } from '../common/telegram-bot.interface';

interface IState {
	waitEnterAddress: boolean;
}

const CANCEL_BUTTON = 'Отмена';
const MANUAL_BUTTON = 'Ввести адрес вручную';
const GEOLOCATION_BUTTON = 'Поделиться геолокацией';
const REQUEST_FOR_CALL_BUTTON = 'Оставить заявку';

@injectable()
export class AddAddressScene extends TelegramBotSceneHandler {
	private mainMarkup = Markup.keyboard([
		[{ text: GEOLOCATION_BUTTON, request_location: true }, { text: MANUAL_BUTTON }],
		[{ text: CANCEL_BUTTON }],
	]).resize();

	private cancelMarkup = Markup.keyboard([[{ text: CANCEL_BUTTON }]]).resize();

	private cancelAndCallMarkup = Markup.keyboard([
		[{ text: CANCEL_BUTTON }, { text: REQUEST_FOR_CALL_BUTTON }],
	]).resize();

	constructor(
		@inject(APP_TOKENS.DaDataService) readonly daDataService: DaDataService,
		@inject(APP_TOKENS.UserService) readonly userService: UserService,
	) {
		super(TG_SCENES.AddAddress);

		this.scene.enter(async (ctx) => {
			await ctx.reply(CommonTemplate.getAddressRequest(), this.mainMarkup);
		});

		this.scene.hears(CANCEL_BUTTON, async (ctx) => {
			await ctx.deleteMessage(ctx.message?.message_id);
			await this.leaveAndRemove(ctx, '😉 Вы можете добавить адрес позже.');
		});

		this.scene.hears(MANUAL_BUTTON, async (ctx) => {
			this.setState<IState>(ctx, { waitEnterAddress: true });
			await ctx.deleteMessage(ctx.message?.message_id);
			await ctx.reply(
				'Введите пожалуйста ваш адрес.\nВ формате: г.Москва, ул.Моховая, д.15',
				this.cancelMarkup,
			);
		});

		this.scene.hears(REQUEST_FOR_CALL_BUTTON, async (ctx) => {
			await ctx.deleteMessage(ctx.message?.message_id);
			await this.leaveAndRemove(ctx, '😊 Спасибо за заявку. Наш менеджер скоро с вами свяжется.');
		});

		this.scene.on('location', async (ctx) => {
			const address = await this.daDataService.getAddressByLocation(ctx.message.location);
			await this.createAddress(ctx, address);
		});

		this.scene.on('text', async (ctx) => {
			const state = this.getState<IState>(ctx);

			if (state?.waitEnterAddress) {
				const address = await this.daDataService.getAddressFromString(ctx.message.text);
				await this.createAddress(ctx, address);
			} else {
				await ctx.reply(CommonTemplate.getUndefinedCommand());
			}
		});
	}

	private async createAddress(
		ctx: ITgContext,
		address: { city: string; street: string; house: string } | null,
	): Promise<void> {
		if (!address) {
			await ctx.reply(
				'☹️ Мы не смогли распознать ваш адрес. Попробуйте еще раз. Или оставьте заявку, чтобы  наш менеджер смог с вами  связаться',
				this.cancelAndCallMarkup,
			);
			return;
		}

		await this.userService.createUserAddressByTgId(ctx.from!.id, address);
		await this.leaveAndRemove(ctx, '😉 Вы успешно добавили новый адрес!');
	}
}
