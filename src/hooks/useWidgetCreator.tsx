import { useEffect, useRef } from "react";
import type { WidgetProps } from "../components/widget/Widget";
import type { FillerProps } from "../components/widget/Filler";
import { useDispatch } from "react-redux";
import { widgetActions } from "../store/widget-slice";
import { useAppSelector, type RootState } from "../store";

export function useWidgetCreator() {
	const dispatch = useDispatch();

	const occupiedPositions = useAppSelector(
		(state: RootState) => state.widget.occupiedPositions
	);
	const occupiedPositionsRef = useRef<[number, number][]>([]);
	useEffect(() => {
		occupiedPositionsRef.current = occupiedPositions;
	}, [occupiedPositions]);

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

	const setOccupiedPositions = (occupiedPositions: [number, number][]) => {
		dispatch(widgetActions.setOccupiedPositions(occupiedPositions));
	};

	const addWidget = (widget: WidgetProps) => {
		console.log("mouse up", widget);
		setUnsavedWidget(widget);
	};

	const handleMouseDown = (filler: FillerProps, e: React.MouseEvent) => {
		if (isDraggingRef.current) return;
		setIsDragging(true);
		setUnsavedWidget(null);
		setSelected([filler]);
		console.log("mouse down", "selected", selectedFillerRef.current);
		e.preventDefault();
	};

	const isSelectionValid = (filler: FillerProps) => {
		if (!isDraggingRef.current) return false;
		if (selectedFillerRef.current.length === 0) return false;

		let minRow = Infinity;
		let maxRow = -Infinity;
		let minCol = Infinity;
		let maxCol = -Infinity;

		console.log("isSelectionInUnoccupiedSpace", "occupied", occupiedPositions);

		for (const s of [...selectedFillerRef.current, filler]) {
			if (s.row < minRow) minRow = s.row;
			if (s.row > maxRow) maxRow = s.row;
			if (s.column < minCol) minCol = s.column;
			if (s.column > maxCol) maxCol = s.column;
		}

		for (const [row, col] of occupiedPositionsRef.current) {
			if (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol)
				return false;
		}

		// console.log(
		// 	"isSelectionInUnoccupiedSpace",
		// 	"new selection",
		// 	`[${filler.row}, ${filler.column}]`
		// );
		// console.log(
		// 	"isSelectionInUnoccupiedSpace",
		// 	"min",
		// 	`[${minRow}, ${minCol}]`
		// );
		// console.log(
		// 	"isSelectionInUnoccupiedSpace",
		// 	"max",
		// 	`[${maxRow}, ${maxCol}]`
		// );

		return true;
	};

	const handleMouseEnter = (filler: FillerProps, e: React.MouseEvent) => {
		if (!isSelectionValid(filler)) {
			return;
		}

		const existingIndex = selectedFillerRef.current.findIndex(
			(f) => f.row === filler.row && f.column === filler.column
		);

		if (existingIndex > -1)
			setSelected(selectedFillerRef.current.slice(0, existingIndex + 1));
		else setSelected([...selectedFillerRef.current, filler]);

		e.preventDefault();
	};

	const handleMouseUp = (e: React.MouseEvent) => {
		if (!isDraggingRef.current) return;
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
		setSelected([]);
		console.log("dragging ended", isDragging);
		e.preventDefault();
	};

	return {
		selectedFiller,
		unsavedWidget,
		handleMouseDown,
		handleMouseEnter,
		handleMouseUp,
		setOccupiedPositions,
	};
}
