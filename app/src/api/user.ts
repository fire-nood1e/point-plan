import {del, get, post} from ".";
import {Preferences} from '@capacitor/preferences';
import {useAppDispatch} from "../store.ts";
import {removeUserSlice, setUserSlice} from "../store/user.ts";
import {HttpHeaders} from "@capacitor/core/types/core-plugins";


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
	});

	const dispatch = useAppDispatch();
	dispatch(setUserSlice(user));
	return user;
}

export async function getSessionConfig(): Promise<HttpHeaders | null> {
	const session = (await Preferences.get({key: 'session'})).value;
	return session ? {Cookie: session} : null;
}

export async function login(data: UserForm) {
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
	const dispatch = useAppDispatch();
	dispatch(removeUserSlice());

	const session = await getSessionConfig();
	if (!session) return;
	await post('/auth/logout', {}, session);
}

export async function myInfo() {
	const session = await getSessionConfig();
	if (!session) return;
	return await setUser((await get('/auth/me', session)).data);
}

export async function register(data: UserForm) {
	return await setUser((await post('/auth/register', data)).data);
}

export async function deleteUser() {
	const session = (await Preferences.get({key: 'session'})).value;
	if (!session) return;
	await Preferences.remove({key: 'session'});
	await Preferences.remove({key: 'user'});
	const dispatch = useAppDispatch();
	dispatch(removeUserSlice());
	await del('/auth', {Cookie: session});
}

export async function changePassword(data: { current: string, password: string }) {
	return await setUser((await post('/auth/password', data)).data);
}

export async function editUser(data: UserEditForm) {
	return await setUser((await post('/auth/info', data)).data);
}

