export class CreateAddressDto {
	constructor(
		readonly userId: number,
		readonly city: string,
		readonly street: string,
		readonly house: string,
	) {}
}
