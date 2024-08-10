import {createSlice} from "@reduxjs/toolkit";
import {Preferences} from "@capacitor/preferences";

const onBoarding = (await Preferences.get({key: "onBoarding"})).value == "true";

export const onBoardingSlice = createSlice({
	name: "onBoarding",
	initialState: {
		value: onBoarding,
	},
	reducers: {
		completeOnBoarding: (state) => {
			Preferences.set({key: "onBoarding", value: "false"});
			state.value = false;
		},
	},
});

export const {completeOnBoarding} = onBoardingSlice.actions;