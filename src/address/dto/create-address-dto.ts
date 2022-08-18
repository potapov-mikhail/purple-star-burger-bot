import { IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
	@IsNumber({}, { message: 'Не указан userId' })
	userId: number;

	@IsString({ message: 'Не указан city' })
	city: string;

	@IsString({ message: 'Не указан street' })
	street: string;

	@IsString({ message: 'Не указан house' })
	house: string;
}
