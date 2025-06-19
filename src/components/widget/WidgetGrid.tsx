import type { PropsWithChildren, ReactElement } from "react";
import React, { useEffect, useMemo } from "react";
import Widget from "./Widget";
import type { WidgetProps } from "./Widget";
import Filler from "./Filler";
import { useWidgetCreator } from "../../hooks/useWidgetCreator";

interface WidgetGridProps extends PropsWithChildren {
	columns: number;
	rows: number;
}

const WidgetGrid = (props: WidgetGridProps) => {
	const { selectedFiller, unsavedWidget, handleMouseUp, setOccupiedPositions } =
		useWidgetCreator();

	useEffect(() => {
		window.addEventListener("mouseup", (e: any) => handleMouseUp(e));
	}, []);

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
				<Widget {...unsavedWidget} unsaved key="unsaved" />,
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

	for (let c = 1; c <= props.columns; c++) {
		for (let r = 1; r <= props.rows; r++) {
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
