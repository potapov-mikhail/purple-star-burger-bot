interface UserParams {
	name: string;
	tgId: number;
}

export class UserEntity {
	name: string;
	tgId: number;

	constructor(params: UserParams) {
		this.name = params.name;
		this.tgId = params.tgId;
	}
}
