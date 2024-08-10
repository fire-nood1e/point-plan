import {createSlice} from "@reduxjs/toolkit";
import {getUser} from "../api/user.ts";

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		value: await getUser(),
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
