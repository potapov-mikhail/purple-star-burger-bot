import { TGError } from './tg-error.class';

export class TGNotFound extends TGError {
	constructor(message?: string) {
		super(message ?? '😮 Упс! Ничего не найдено');
	}
}
