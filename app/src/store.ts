import {createContext, Dispatch, SetStateAction} from "react";
import {User} from "./api/user.ts";

export const UserContext = createContext({
	user: null as User | null,
	setUser: null as unknown as Dispatch<SetStateAction<User | null>>
});
