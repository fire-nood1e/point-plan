import {del, get, post, put} from ".";
import {Preferences} from '@capacitor/preferences';
import {HttpHeaders} from "@capacitor/core/types/core-plugins";
import {Dispatch, SetStateAction} from "react";


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

async function setUser(user: User, updateUser: Dispatch<SetStateAction<User | null>>): Promise<User> {
	await Preferences.set({
		key: 'user',
		value: JSON.stringify(user),
	});

	updateUser(user);

	return user;
}

export async function getSessionConfig(): Promise<HttpHeaders | null> {
	const session = (await Preferences.get({key: 'session'})).value;
	return session ? {Cookie: session} : null;
}

export async function login(data: UserForm, updateUser: Dispatch<SetStateAction<User | null>>) {
	try {
		const res = await post("/auth/login", data);
		const session =
			res.headers["set-cookie"]?.[0]
				?.split(";")
				?.find((c) => c.includes("session=")) ?? "";

		await Preferences.set({
			key: 'session',
			value: session.trim(),
		});

		return await setUser(res.data as User, updateUser);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		await Preferences.remove({key: 'session'});
		return null;
	}
}

export async function logout(updateUser: Dispatch<SetStateAction<User | null>>) {
	await Preferences.remove({key: 'session'});
	await Preferences.remove({key: 'user'});
	updateUser(null);

	const session = await getSessionConfig();
	if (!session) return;
	await post('/auth/logout', {}, session);
}

export async function myInfo(updateUser: Dispatch<SetStateAction<User | null>>) {
	const session = await getSessionConfig();
	if (!session) return;
	return await setUser((await get('/auth/me', session)).data, updateUser);
}

export async function register(data: UserForm, updateUser: Dispatch<SetStateAction<User | null>>) {
	return await setUser((await post('/auth/register', data)).data, updateUser);
}

export async function deleteUser(updateUser: Dispatch<SetStateAction<User | null>>) {
	const session = (await Preferences.get({key: 'session'})).value;
	if (!session) return;
	await Preferences.remove({key: 'session'});
	await Preferences.remove({key: 'user'});
	updateUser(null);
	await del('/auth', {Cookie: session});
}

export async function changePassword(data: { current: string, password: string }, updateUser: Dispatch<SetStateAction<User | null>>) {
	return await setUser((await put('/auth/password', data)).data, updateUser);
}

export async function editUser(data: UserEditForm, updateUser: Dispatch<SetStateAction<User | null>>) {
	return await setUser((await put('/auth/info', data)).data, updateUser);
}

