export const CartAction = {
	Cart: 'cart',
	AddBurgerToCart: /onAddBurgerToCart-+[0-9]*/,
	DeleteBurgerFromCart: /onDeleteBurgerFromCart-+[0-9]*/,
	AddDrinkToCart: /onAddDrinkToCart-+[0-9]*/,
	DeleteDrinkFromCart: /onDeleteDrinkFromCart-+[0-9]*/,
};

export const CartActionPrefix = {
	AddBurgerToCart: 'onAddBurgerToCart',
	DeleteBurgerFromCart: 'onDeleteBurgerFromCart',
	AddDrinkToCart: 'onAddDrinkToCart',
	DeleteDrinkFromCart: 'onDeleteDrinkFromCart',
};
