export abstract class PaginationTemplate {
	static getPaginationMarkupTemplate(
		current: number,
		prefix: string,
		isLast = false,
	): { text: string; callback_data: string }[][] {
		const all = [
			{ text: `< `, callback_data: `${prefix}-${current - 1}` },
			{ text: ` >`, callback_data: `${prefix}-${current + 1}` },
		];

		if (current === 1) {
			all.splice(0, 1);
		}

		if (isLast) {
			all.splice(1, 1);
		}

		return [all];
	}
}
