import { useEffect, useRef, useState } from "react";
import type { FillerProps } from "../components/widget/Filler";
import type { WidgetLoading } from "../components/widget/Widget";

export interface GridItemPosition {
	colStart: number;
	rowStart: number;
	colEnd: number;
	rowEnd: number;
}

export interface GridItem {
	position: GridItemPosition;
	unsaved?: boolean;
	isLoading?: WidgetLoading;
	editMode?: boolean;
	onSave?: (item: any) => void;
	removeItem?: (id?: string) => void;
}

export type PlacerMode = "NONE" | "CELL_DRAG";

export function useGridItemPlacer<T extends GridItem>(
	mode: PlacerMode = "CELL_DRAG"
) {
	if (mode === "NONE") {
		return {
			selectedFiller: [],
			placedGridItem: null,
			setPlacedItemToLoading: () => {},
			removePlacedItem: () => {},
			handleMouseDown: () => {},
			handleMouseEnter: () => {},
			handleMouseUp: () => {},
			setOccupiedPositions: () => {},
		};
	}

	const [isDragging, setIsDragging] = useState(false);
	const [selectedFiller, setSelectedFiller] = useState<FillerProps[]>([]);
	const [placedGridItem, setPlacedItem] = useState<T | null>(null);
	const [occupiedPositions, setOccupiedPositions] = useState<
		[number, number][]
	>([]);

	const isDraggingRef = useRef(isDragging);
	useEffect(() => {
		isDraggingRef.current = isDragging;
	}, [isDragging]);

	const selectedFillerRef = useRef(selectedFiller);
	useEffect(() => {
		selectedFillerRef.current = selectedFiller;
	}, [selectedFiller]);

	const addGridItem = (item: T) => {
		console.log("mouse up", item);
		setPlacedItem(item);
	};

	const removePlacedItem = () => {
		setPlacedItem(null);
	};

	const setPlacedItemToLoading = () => {
		if (placedGridItem) {
			setPlacedItem({
				...placedGridItem,
				isLoading: { isLoading: true, message: "Saving widget" },
			});
		}
	};

	const handleMouseDown = (filler: FillerProps, e: React.MouseEvent) => {
		if (isDraggingRef.current) return;
		setIsDragging(true);
		setPlacedItem(null);
		setSelectedFiller([filler]);
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

		for (const [row, col] of occupiedPositions) {
			if (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol)
				return false;
		}

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
			setSelectedFiller(selectedFillerRef.current.slice(0, existingIndex + 1));
		else setSelectedFiller([...selectedFillerRef.current, filler]);

		e.preventDefault();
	};

	const handleMouseUp = (e: React.MouseEvent) => {
		console.log("mouse up", isDragging, "selected", selectedFillerRef.current);
		if (!isDraggingRef.current) return;
		setIsDragging(false);
		addGridItem({
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
		} as T);
		setSelectedFiller([]);
		console.log("dragging ended", isDragging);
		e.preventDefault();
	};

	return {
		selectedFiller,
		placedGridItem,
		setPlacedItemToLoading,
		removePlacedItem,
		handleMouseDown,
		handleMouseEnter,
		handleMouseUp,
		setOccupiedPositions,
	};
}
