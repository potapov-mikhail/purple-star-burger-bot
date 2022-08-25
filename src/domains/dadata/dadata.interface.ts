export interface IDDLocation {
	latitude: number;
	longitude: number;
}

export interface IDDAddress {
	city: string;
	street: string;
	house: string;
}

export interface IDDData {
	city?: string;
	region?: string;
	street?: string;
	house?: string;
}

export interface IDDSuggestion {
	value: string;
	unrestricted_value: string;
	data: IDDData;
}

export interface IDDLocationResponse {
	suggestions: IDDSuggestion[];
}
