import {get} from "./index.ts";

export type Data = [number, number, number];

export async function getData(type: string, date: string) {
	const data = (await get(`/data?type=${type}&date=${date}`)).data as string;

	return data.split("\n").map((line) => {
		const [lat, lon, value] = line.split(",");
		return [parseFloat(lat), parseFloat(lon), parseFloat(value)] as Data;
	});
}
