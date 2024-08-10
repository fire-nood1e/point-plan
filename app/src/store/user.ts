import {createSlice} from "@reduxjs/toolkit";
import {User} from "../api/user.ts";

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		value: null as User | null,
	},
	reducers: {
		setUserSlice: (state, action) => {
			state.value = action.payload;
		},
		removeUserSlice: (state) => {
			state.value = null;
		}
	},
});

export const {setUserSlice, removeUserSlice} = userSlice.actions;
