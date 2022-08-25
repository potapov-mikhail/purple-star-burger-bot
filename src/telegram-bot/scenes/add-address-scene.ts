import { Markup } from 'telegraf';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { DaDataService } from '../../domains/dadata/dadata.service';
import { UserService } from '../../domains/user/user.service';
import { TG_SCENES, TG_TRIGGERS } from '../telegram-bot-triggers';
import { CommonTemplate } from '../templates/common-template';
import { TelegramBotSceneHandler } from '../common/telegram-bot-scene-handler/telegram-bot-scene-handler';
import { ITgContext } from '../common/telegram-bot.interface';
import { ConflictException } from '../../common/exceptions/exceptions';
import { TGError } from '../errors/tg-error.class';
import { ProfileTemplate } from '../templates/profile-template';
import { IDDAddress } from '../../domains/dadata/dadata.interface';

interface IState {
	unverifiedAddress?: IDDAddress;
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

	private locationConfirmMarkup = Markup.inlineKeyboard([
		{ text: 'Да', callback_data: `${TG_TRIGGERS.ConfirmAddress}` },
		{ text: 'Нет', callback_data: TG_TRIGGERS.RejectAddress },
	]);

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
			this.patchState<IState>(ctx, { waitEnterAddress: true });
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

			if (address) {
				this.patchState<IState>(ctx, { unverifiedAddress: address });
				await ctx.reply(
					`Это ваш адрес? \n ${ProfileTemplate.getAddress(address)}`,
					this.locationConfirmMarkup,
				);
			} else {
				await this.createAddress(ctx, address);
			}
		});

		this.scene.action(TG_TRIGGERS.ConfirmAddress, async (ctx) => {
			const { unverifiedAddress } = this.getState<IState>(ctx) || {};

			if (unverifiedAddress) {
				await this.createAddress(ctx, unverifiedAddress);
			} else {
				await ctx.reply('Не удалось подтвердить адрес');
			}
		});

		this.scene.action(TG_TRIGGERS.RejectAddress, async (ctx) => {
			this.patchState<IState>(ctx, { unverifiedAddress: undefined });
			await ctx.deleteMessage();
			await ctx.reply('☹️ Вы можете попробовать еще раз или ввести адрес вручную');
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

		try {
			await this.userService.createUserAddressByTgId(ctx.from!.id, address);
			this.patchState<IState>(ctx, { unverifiedAddress: undefined });
		} catch (e) {
			if (e instanceof ConflictException) {
				throw new TGError('🤨 Этот адрес уже добавлен');
			}
			throw e;
		}

		await this.leaveAndRemove(ctx, '😉 Вы успешно добавили новый адрес!');
	}
}
