import axios, { AxiosInstance } from 'axios';
import { inject, injectable } from 'inversify';
import { APP_TOKENS } from '../../container/tokens';
import { IConfigService } from '../../common/config/config.interface';
import { IDDAddress, IDDData, IDDLocation, IDDLocationResponse } from './dadata.interface';

@injectable()
export class DaDataService {
	private readonly token: string;
	private readonly secret: string;
	private readonly request: AxiosInstance;

	constructor(@inject(APP_TOKENS.ConfigService) private configService: IConfigService) {
		this.token = this.configService.get('DADATA_TOKEN');
		this.secret = this.configService.get('DADATA_SECRET');

		this.request = axios.create({
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'Token ' + this.token,
			},
		});
	}

	async getAddressByLocation(location: IDDLocation): Promise<IDDAddress | null> {
		const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address';
		const payload = { lat: location.latitude, lon: location.longitude };

		try {
			const response = await this.request.post(url, payload);
			const body: IDDLocationResponse = await response.data;
			const [{ data }] = body.suggestions;
			return this.parseAddress(data);
		} catch (e) {
			return null;
		}
	}

	async getAddressFromString(source: string): Promise<IDDAddress | null> {
		const url = 'https://cleaner.dadata.ru/api/v1/clean/address';
		const payload = [source];

		try {
			const response = await this.request.post(url, payload, {
				headers: { 'X-Secret': this.secret },
			});
			const body: IDDData[] = await response.data;
			return this.parseAddress(body[0]);
		} catch (e) {
			return null;
		}
	}

	private parseAddress(data: IDDData): IDDAddress | null {
		const params = {
			city: data.city || data.region,
			street: data.street,
			house: data.house,
		};

		const isNotEmpty = Object.values(params).every(Boolean);

		return isNotEmpty ? (params as IDDAddress) : null;
	}
}
