import { useEffect, useRef } from "react";
import type { WidgetProps } from "../components/widget/Widget";
import type { FillerProps } from "../components/widget/Filler";
import { useDispatch } from "react-redux";
import { widgetActions } from "../store/widget-slice";
import { useAppSelector, type RootState } from "../store";

export function useWidgetResizer() {
	const dispatch = useDispatch();

	const isDragging = useAppSelector(
		(state: RootState) => state.widget.isDragging
	);
	const isDraggingRef = useRef(isDragging);
	useEffect(() => {
		isDraggingRef.current = isDragging;
	}, [isDragging]);

	const selectedFiller = useAppSelector(
		(state) => state.widget.selectedFillers
	);
	const selectedFillerRef = useRef(selectedFiller);
	useEffect(() => {
		selectedFillerRef.current = selectedFiller;
	}, [selectedFiller]);

	const unsavedWidget = useAppSelector(
		(state: RootState) => state.widget.unsavedWidget
	);
	const unsavedWidgetRef = useRef(unsavedWidget);
	useEffect(() => {
		unsavedWidgetRef.current = unsavedWidget;
	}, [unsavedWidget]);

	const setIsDragging = (isDragging: boolean) => {
		dispatch(widgetActions.setIsDragging(isDragging));
	};

	const setSelected = (fillers: FillerProps[]) => {
		dispatch(widgetActions.setSelected(fillers));
	};

	const setUnsavedWidget = (widget: WidgetProps | null) => {
		dispatch(widgetActions.setUnsavedWidget(widget));
	};

	const addWidget = (widget: WidgetProps) => {
		console.log("mouse up", widget);
		setUnsavedWidget(widget);
	};

	const handleMouseDown = (filler: FillerProps, e: React.MouseEvent) => {
		setIsDragging(true);
		setUnsavedWidget(null);
		setSelected([filler]);
		console.log("mouse down", "selected", selectedFillerRef.current);
		e.preventDefault();
	};

	const handleMouseEnter = (filler: FillerProps, e: React.MouseEvent) => {
		if (!isDraggingRef.current || selectedFillerRef.current.length === 0)
			return;

		const existingIndex = selectedFillerRef.current.findIndex(
			(f) => f.row === filler.row && f.column === filler.column
		);

		if (existingIndex > -1)
			setSelected(selectedFillerRef.current.slice(0, existingIndex + 1));
		else setSelected([...selectedFillerRef.current, filler]);

		e.preventDefault();
	};

	const handleMouseUp = (e: React.MouseEvent) => {
		setIsDragging(false);
		console.log("mouse up", "selected", selectedFillerRef.current);
		addWidget({
			position: {
				rowStart: Math.min(
					...selectedFillerRef.current.map((props) => props.row)
				),
				rowEnd:
					Math.max(...selectedFillerRef.current.map((props) => props.row)) + 1,
				colStart: Math.min(
					...selectedFillerRef.current.map((props) => props.column)
				),
				colEnd:
					Math.max(...selectedFillerRef.current.map((props) => props.column)) +
					1,
			},
		});
		console.log("dragging ended", isDragging);
		e.preventDefault();
	};

	return {
		selectedFiller,
		unsavedWidget,
		handleMouseDown,
		handleMouseEnter,
		handleMouseUp,
	};
}
