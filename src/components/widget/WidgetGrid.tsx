import type { PropsWithChildren, ReactElement } from "react";
import React, { useEffect, useMemo } from "react";
import Widget from "./Widget";
import type { WidgetData, WidgetProps } from "./Widget";
import Filler from "./Filler";
import { useGridItemPlacer } from "../../hooks/useGridItemPlacer";

interface WidgetGridProps extends PropsWithChildren {
	columns: number;
	rows: number;
	onWidgetTypeSelect?: (widget: WidgetData) => void;
}

const WidgetGrid = (props: WidgetGridProps) => {
	const {
		selectedFiller,
		placedGridItem: unsavedWidget,
		removePlacedItem: removeUnsavedWidget,
		setPlacedItemToLoading: setUnsavedWidgetToLoading,
		handleMouseUp,
		handleMouseDown,
		handleMouseEnter,
		setOccupiedPositions,
	} = useGridItemPlacer<WidgetProps>();

	useEffect(() => {
		window.addEventListener("mouseup", (e: any) => handleMouseUp(e));
	}, []);

	useEffect(() => {
		removeUnsavedWidget();
	}, [props.children]);

	const onWidgetTypeSelect = (widget: WidgetData) => {
		props.onWidgetTypeSelect
			? props.onWidgetTypeSelect(widget)
			: console.error("onWidgetTypeSelect is udnefined");
		setUnsavedWidgetToLoading();
	};

	const widgets = useMemo(() => {
		const childrenArray = React.Children.toArray(
			props.children
		) as ReactElement[];
		const baseWidgets = childrenArray.filter(
			(c): c is ReactElement<WidgetProps> => c.type === Widget
		);

		if (childrenArray.length > baseWidgets.length)
			console.error(
				`${
					childrenArray.length - baseWidgets.length
				} child(ren) of WidgetGrid aren't Widgets`
			);

		if (unsavedWidget) {
			return [
				...baseWidgets,
				<Widget
					{...unsavedWidget}
					unsaved
					removeWidget={removeUnsavedWidget}
					onWidgetTypeSelect={onWidgetTypeSelect}
					key="unsaved"
				/>,
			];
		}

		return baseWidgets;
	}, [props.children, unsavedWidget]);

	const occupiedPositions = useMemo(() => {
		return widgets.reduce<[number, number][]>((arr, w) => {
			const positions: [number, number][] = [];
			for (
				let c = w.props.position.colStart;
				c < w.props.position.colEnd;
				c++
			) {
				for (
					let r = w.props.position.rowStart;
					r < w.props.position.rowEnd;
					r++
				) {
					positions.push([r, c]);
				}
			}
			return [...arr, ...positions];
		}, []);
	}, [widgets]);

	useEffect(() => {
		console.log(
			"isSelectionInUnoccupiedSpace",
			"setting occupied",
			occupiedPositions
		);
		setOccupiedPositions(occupiedPositions);
	}, [occupiedPositions]);

	const fillers = [];
	console.log(occupiedPositions);

	for (let c = 1; c <= props.rows; c++) {
		for (let r = 1; r <= props.columns; r++) {
			const isOccupied = occupiedPositions.some(
				([row, col]) => row === r && col === c
			);
			if (!isOccupied) {
				fillers.push(
					<Filler
						key={`widget-filler-${r}-${c}`}
						row={r}
						column={c}
						selected={
							selectedFiller &&
							selectedFiller.some(
								(props) => props.row === r && props.column === c
							)
						}
						handleMouseDown={handleMouseDown}
						handleMouseEnter={handleMouseEnter}
					/>
				);
			}
		}
	}

	return (
		<div
			className="widget-grid"
			style={{
				gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
				gridTemplateRows: `repeat(${props.rows}, 1fr)`,
			}}
		>
			{widgets}
			{fillers}
		</div>
	);
};

export default WidgetGrid;
