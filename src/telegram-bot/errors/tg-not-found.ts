import { TGError } from './tg-error.class';

export class TGNotFound extends TGError {
	constructor() {
		super('😮 Упс! Ничего не найдено');
	}
}
