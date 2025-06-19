import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FillerProps } from "../components/widget/Filler";
import type { WidgetProps } from "../components/widget/Widget";

export interface WidgetState {
	isDragging: boolean;
	selectedFillers: FillerProps[];
	unsavedWidget: WidgetProps | null;
}

const initialState: WidgetState = {
	isDragging: false,
	selectedFillers: [],
	unsavedWidget: null,
};

const widgetSlice = createSlice({
	name: "widget",
	initialState: initialState,
	reducers: {
		setIsDragging(state, action: PayloadAction<boolean>) {
			state.isDragging = action.payload;
		},
		setSelected(state, action: PayloadAction<FillerProps[]>) {
			state.selectedFillers = action.payload;
		},
		setUnsavedWidget(state, action: PayloadAction<WidgetProps | null>) {
			state.unsavedWidget = action.payload;
		},
	},
});

export const widgetActions = widgetSlice.actions;

export default widgetSlice.reducer;
