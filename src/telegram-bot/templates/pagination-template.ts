export abstract class PaginationTemplate {
	static getPaginationMarkupTemplate(
		current: number,
		prefix: string,
		isLast = false,
	): { text: string; callback_data: string }[][] {
		const all = [];

		if (current !== 1) {
			all.push({ text: `< `, callback_data: `${prefix}-${current - 1}` });
		}

		if (!isLast) {
			all.push({ text: ` >`, callback_data: `${prefix}-${current + 1}` });
		}

		return [all];
	}
}
