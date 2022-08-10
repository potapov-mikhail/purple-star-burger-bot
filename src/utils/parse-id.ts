export function parseId(str: unknown): number | null {
	if (typeof str !== 'string') {
		return null;
	}

	const result = str.match(/\d+/g);

	return Array.isArray(result) ? Number(result[0]) : null;
}
