import type { CSSProperties, PropsWithChildren, ReactElement } from "react";
import React, { useEffect, useMemo } from "react";
import Filler from "./Filler";
import {
	useGridItemPlacer,
	type GridItem,
	type PlacerMode,
} from "../../hooks/grid/useGridItemPlacer";

interface GridProps<P extends GridItem> extends PropsWithChildren {
	columns: number;
	rows: number;
	placerMode?: PlacerMode;
	mobile?: boolean;
	editMode?: boolean;
	onSaveGridItem: (item: P) => void;
	setError?: (error: String | null) => void;
	ItemComponent: React.ComponentType<P>;
	style?: CSSProperties;
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
		const baseWidgets = childrenArray
			.filter((c): c is ReactElement<P> => c.type === props.ItemComponent)
			.map((c) =>
				React.cloneElement(c, { ...c.props, editMode: props.editMode })
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
					setError={props.setError}
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
		setOccupiedPositions(occupiedPositions);
	}, [occupiedPositions]);

	const fillers = [];

	for (let c = 1; c <= props.rows; c++) {
		for (let r = 1; r <= props.columns; r++) {
			const isOccupied = occupiedPositions.some(
				([row, col]) => row == r && col == c
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
						mobile={props.mobile}
						active={props.editMode ?? false}
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
				...props.style,
			}}
		>
			{widgets}
			{fillers}
		</div>
	);
};

export default Grid;
