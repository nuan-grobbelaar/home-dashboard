import type { PropsWithChildren, ReactElement } from "react";
import React, { useEffect, useMemo } from "react";
import Filler from "./Filler";
import {
	useGridItemPlacer,
	type GridItem,
	type PlacerMode,
} from "../../hooks/useGridItemPlacer";

interface GridProps<P extends GridItem> extends PropsWithChildren {
	columns: number;
	rows: number;
	placerMode?: PlacerMode;
	onSaveGridItem: (item: P) => void;

	ItemComponent: React.ComponentType<P>;
}

const Grid = <P extends GridItem>(props: GridProps<P>) => {
	type ItemComponentProps = P;

	const {
		selectedFiller,
		placedGridItem,
		removePlacedItem,
		setPlacedItemToLoading,
		handleMouseUp,
		handleMouseDown,
		handleMouseEnter,
		setOccupiedPositions,
	} = useGridItemPlacer<ItemComponentProps>(props.placerMode);

	useEffect(() => {
		window.addEventListener("mouseup", (e: any) => handleMouseUp(e));
	}, []);

	useEffect(() => {
		removePlacedItem();
	}, [props.children]);

	const onSaveGridItem = (item: P) => {
		props.onSaveGridItem
			? props.onSaveGridItem(item)
			: console.error("onSaveGridItem is udnefined");
		setPlacedItemToLoading();
	};

	const widgets = useMemo(() => {
		const childrenArray = React.Children.toArray(
			props.children
		) as ReactElement[];
		const baseWidgets = childrenArray.filter(
			(c): c is ReactElement<P> => c.type === props.ItemComponent
		);

		if (childrenArray.length > baseWidgets.length)
			console.error(
				`${
					childrenArray.length - baseWidgets.length
				} child(ren) of Grid aren't GridItems`
			);

		if (placedGridItem) {
			return [
				...baseWidgets,
				<props.ItemComponent
					{...placedGridItem}
					unsaved
					removeItem={removePlacedItem}
					onSave={onSaveGridItem}
					key="unsaved"
				/>,
			];
		}

		return baseWidgets;
	}, [props.children, placedGridItem]);

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
			console.log("OCCUPIEDD", occupiedPositions);
			const isOccupied = occupiedPositions.some(
				([row, col]) => row == r && col == c
			);
			if (!isOccupied) {
				console.log("OCCUPIEDD", "PUSH");
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

export default Grid;
