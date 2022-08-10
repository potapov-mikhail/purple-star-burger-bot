export function computePagination(
	page: number,
	limit: number,
	defaultLimit = 10,
): { skip: number; take: number } {
	const take = limit > 0 ? limit : defaultLimit;
	const skip = page > 1 ? (page - 1) * take : 0;

	return { take, skip };
}
