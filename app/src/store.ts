import {configureStore} from '@reduxjs/toolkit'
import {useDispatch, useSelector} from "react-redux";
import {userSlice} from "./store/user.ts";
import {onBoardingSlice} from "./store/onBoarding.ts";

const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		onBoarding: onBoardingSlice.reducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

