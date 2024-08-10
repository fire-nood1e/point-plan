import {CapacitorHttp, HttpOptions} from "@capacitor/core";

const API_URL = "http://point-plan.buttercrab.net/api";

export async function get(url: string, options?: Partial<HttpOptions>) {
	return (await CapacitorHttp.get({
		...options,
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
	}));
}

export async function post(url: string, data: object, options?: Partial<HttpOptions>) {
	return (await CapacitorHttp.post({
		...options,
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
		data,
	}));
}

export async function put(url: string, data: object, options?: Partial<HttpOptions>) {
	return (await CapacitorHttp.put({
		...options,
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
		data,
	}));
}

export async function del(url: string, options?: Partial<HttpOptions>) {
	return (await CapacitorHttp.delete({
		...options,
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
	}));
}
