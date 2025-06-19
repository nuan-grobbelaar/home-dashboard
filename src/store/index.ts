import { configureStore } from "@reduxjs/toolkit";

import widgetReducer from "./widget-slice.ts";
import { useSelector, type TypedUseSelectorHook } from "react-redux";

const store = configureStore({
	reducer: {
		widget: widgetReducer,
	},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
