import type { PropsWithChildren, ReactElement } from "react";
import React from "react";
import Widget from "./Widget";
import type { WidgetPosition, WidgetProps } from "./Widget";
import Filler from "./Filler";

interface WidgetGridProps extends PropsWithChildren {
	columns: number;
	rows: number;
	handleMouseDown: (row: number, col: number, e: React.MouseEvent) => void;
}

const WidgetGrid = (props: WidgetGridProps) => {
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
					<Filler
						key={`widget-filler-${r}-${c}`}
						row={r}
						column={c}
						handleMouseDown={props.handleMouseDown}
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
