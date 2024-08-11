import {get} from "./index.ts";

export type Data = [number, number, number];

export async function getData(type: string, date: string) {
	const data = (await get(`/data/?type=${type}&time=${date}`)).data as string;

	const ret = data.split("\n").map((line) => {
		const [lat, lon, value] = line.split(",");
		return [parseFloat(lat), parseFloat(lon), parseFloat(value)] as Data;
	});

	return ret;
}
