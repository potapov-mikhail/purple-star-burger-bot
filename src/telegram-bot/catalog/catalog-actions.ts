export const CatalogAction = {
	burgerList: 'burgers',
	burgerCard: /burger+[0-9]*/,
	burgerChangePage: /onChangeBurgersPage-+[0-9]*/,

	drinkList: 'drinks',
	drinkCard: /drink+[0-9]*/,
	drinkChangePage: /onChangeDrinksPage-+[0-9]*/,
};

export const CatalogActionPrefix = {
	burgerChangePage: 'onChangeBurgersPage',
	drinkChangePage: 'onChangeDrinksPage',
};
