import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString({ message: 'Не указан name' })
	name: string;

	@IsNumber({}, { message: 'Не указан tgId' })
	tgId: number;
}
