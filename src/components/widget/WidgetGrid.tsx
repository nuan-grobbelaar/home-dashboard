import type { PropsWithChildren, ReactElement } from "react";
import React from "react";
import Widget from "./Widget";
import type { WidgetProps } from "./Widget";
import Filler from "./Filler";
import type { FillerProps } from "./Filler";

interface WidgetGridProps extends PropsWithChildren {
	columns: number;
	rows: number;
}

const WidgetGrid = (props: WidgetGridProps) => {
	const totalCells = props.rows * props.columns;

	const childrenArray = React.Children.toArray(
		props.children
	) as ReactElement[];

	console.log(childrenArray);

	const widgets: ReactElement<WidgetProps>[] = childrenArray.filter(
		(c): c is ReactElement<WidgetProps> => c.type === Widget
	);

	console.log(widgets);

	if (childrenArray.length > widgets.length)
		console.error(
			`${
				childrenArray.length - widgets.length
			} child(ren) of WidgetGrid aren't Widgets`
		);

	const widgetCells = widgets.reduce(
		(count, w) =>
			(count +=
				(w.props.position.colEnd - w.props.position.colStart) *
				(w.props.position.rowEnd - w.props.position.rowStart)),
		0
	);

	const occupiedPositions: [number, number][] = widgets.reduce(
		(arr: [number, number][], w) => {
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
		},
		[]
	);

	const fillers = [];
	console.log(occupiedPositions);

	for (let c = 1; c <= props.columns; c++) {
		for (let r = 1; r <= props.rows; r++) {
			const isOccupied = occupiedPositions.some(
				([row, col]) => row === r && col === c
			);
			if (!isOccupied) {
				fillers.push(
					<Filler key={`widget-filler-${r}-${c}`} row={r} column={c} />
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
