import { configureStore } from "@reduxjs/toolkit";

import { useSelector, type TypedUseSelectorHook } from "react-redux";

const store = configureStore({
	reducer: {},
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch;
