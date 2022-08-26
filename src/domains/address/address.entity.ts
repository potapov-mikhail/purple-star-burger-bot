interface AddressParams {
	city: string;
	street: string;
	house: string;
}

export class AddressEntity {
	city: string;
	street: string;
	house: string;

	constructor(params: AddressParams) {
		this.city = params.city;
		this.street = params.street;
		this.house = params.house;
	}
}
