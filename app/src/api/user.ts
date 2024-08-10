import {ax} from ".";
import {Preferences} from '@capacitor/preferences';
import {AxiosRequestConfig} from "axios";


export type UserForm = {
	username: string;
	password: string;
}

export type UserEditForm = {
	username: string;
	nickname: string;
}

export type User = {
	user_id: number;
	username: string;
	nickname: string | null;
	profile_img: string | null;
}

export async function getUser() {
	const user = (await Preferences.get({key: 'user'})).value;
	return user ? JSON.parse(user) as User : null;
}

async function setUser(user: User): Promise<User> {
	await Preferences.set({
		key: 'user',
		value: JSON.stringify(user),
	})
	return user;
}

export async function getSessionConfig<D>(): Promise<AxiosRequestConfig<D>> {
	const session = (await Preferences.get({key: 'session'})).value;
	return {headers: {Cookie: session}};
}

export async function login(data: UserForm) {
	try {
		const res = await ax.post("/user/login", data);
		const session =
			res.headers["set-cookie"]?.[0]
				?.split(";")
				?.find((c) => c.includes("session=")) ?? "";

		await Preferences.set({
			key: 'session',
			value: session.trim(),
		});

		return await setUser(res.data as User);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		await Preferences.remove({key: 'session'});
		return null;
	}
}

export async function logout() {
	await Preferences.remove({key: 'session'});
	await Preferences.remove({key: 'user'});
	await ax.post('/user/logout', {}, await getSessionConfig());
}

export async function myInfo() {
	return await setUser((await ax.get('/user/me', await getSessionConfig())).data);
}

export async function register(data: UserForm) {
	return await setUser((await ax.post('/user/register', data)).data);
}

export async function deleteUser() {
	const session = (await Preferences.get({key: 'session'})).value;
	await Preferences.remove({key: 'session'});
	await ax.delete('/user', {headers: {Cookie: session}});
}

export async function changePassword(data: { current: string, password: string }) {
	return await setUser((await ax.post('/user/password', data)).data);
}

export async function editUser(data: UserEditForm) {
	return await setUser((await ax.post('/user/info', data)).data);
}

