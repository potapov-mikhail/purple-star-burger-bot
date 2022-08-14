import { parseId } from '../../utils/parse-id';

export const validateId = (ctx: any, next: any) => {
	const id = parseId(ctx.match[0]);
	if (!id) {
		ctx.reply('Не корректный id');
	} else {
		next();
	}
};
