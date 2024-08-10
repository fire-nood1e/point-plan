import {CapacitorHttp} from "@capacitor/core";
import {HttpHeaders} from "@capacitor/core/types/core-plugins";

const API_URL = "https://point-plan.buttercrab.net/api";

export async function get(url: string, headers?: HttpHeaders) {
	return (await CapacitorHttp.get({
		headers: {
			...headers,
			"Origin": "https://point-plan.buttercrab.net",
		},
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
	}));
}

export async function post(url: string, data: object, headers?: HttpHeaders) {
	return (await CapacitorHttp.post({
		headers: {
			...headers,
			"Origin": "https://point-plan.buttercrab.net",
			"Content-Type": "application/json",
		},
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
		data,
	}));
}

export async function put(url: string, data: object, headers?: HttpHeaders) {
	return (await CapacitorHttp.put({
		headers: {
			...headers,
			"Origin": "https://point-plan.buttercrab.net",
		},
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
		data,
	}));
}

export async function del(url: string, headers?: HttpHeaders) {
	return (await CapacitorHttp.delete({
		headers: {
			...headers,
			"Origin": "https://point-plan.buttercrab.net",
		},
		readTimeout: undefined,
		connectTimeout: undefined,
		url: API_URL + url,
	}));
}
