import { useEffect, useState, type PropsWithChildren } from "react";
import WidgetTypeSelect from "./WidgetTypeSelect";
import type { GridItem, GridItemPosition } from "../../hooks/useGridItemPlacer";
import Grid from "./Grid";
import WidgetComponent from "./WidgetComponent";
import Barchart from "../graphs/Barchart";

export interface WidgetData {
	id?: any;
	type?: string;
	position: GridItemPosition;
}

export interface WidgetProps extends GridItem, PropsWithChildren {
	id?: any;
	type?: string;
	columns?: number; //TODO: why do these have to be generic?
	rows?: number;
}

export const getWidgetId = (props: WidgetProps) => {
	return `${props.type}-${props.position.colStart}-${props.position.rowStart}-${props.position.colEnd}-${props.position.rowEnd}`;
};

const Widget = (props: WidgetProps) => {
	const [data, setData] = useState([
		{ title: "jan", value: 10000, color: "#B7DDE9" },
		{ title: "feb", value: 9500, color: "#D6C9E5" },
		{ title: "mar", value: 8000, color: "#CFFFE5" },
		{ title: "apr", value: 6000, color: "#FFDAB9" },
		{ title: "may", value: 7500, color: "#FFF9C4" },
		{ title: "jun", value: 7200, color: "#FFCCC9" },
		{ title: "jul", value: 8500, color: "#A3CEF1" },
		{ title: "aug", value: 8700, color: "#E6D0F1" },
		{ title: "sep", value: 7900, color: "#FAD6BF" },
		{ title: "oct", value: 8800, color: "#F9D6D5" },
		{ title: "nov", value: 9400, color: "#E8D49D" },
		{ title: "dec", value: 545, color: "#A3C1AD" },
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setData([
				{ title: "jan", value: 8000, color: "#B7DDE9" },
				{ title: "feb", value: 9600, color: "#D6C9E5" },
				{ title: "mar", value: 8020, color: "#CFFFE5" },
				{ title: "apr", value: 7000, color: "#FFDAB9" },
				{ title: "may", value: 7501, color: "#FFF9C4" },
				{ title: "jun", value: 7400, color: "#FFCCC9" },
				{ title: "jul", value: 8600, color: "#A3CEF1" },
				{ title: "aug", value: 8750, color: "#E6D0F1" },
				{ title: "sep", value: 8000, color: "#FAD6BF" },
				{ title: "oct", value: 9100, color: "#F9D6D5" },
				{ title: "nov", value: 9500, color: "#E8D49D" },
				{ title: "dec", value: 6000, color: "#A3C1AD" },
			]);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			className="widget-grid__widget"
			data-unsaved={props.unsaved}
			style={{
				gridArea: `${props.position.colStart} / ${props.position.rowStart} / ${props.position.colEnd} / ${props.position.rowEnd}`,
				gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
				gridTemplateRows: `repeat(${props.rows}, 1fr)`,
			}}
		>
			{(props.unsaved || props.editMode) && (
				<button
					className="close-button"
					onClick={() => props.removeItem?.(props.id) ?? undefined}
				>
					x
				</button>
			)}

			{props.isLoading ? (
				"Loading"
			) : props.unsaved && props.onSave && !props.isLoading ? (
				<WidgetTypeSelect
					options={[
						"todo",
						"weather",
						"transport",
						"budget",
						"recipes",
						"calendar",
						"xxxxxxxxxxxxxxxxxx",
					]}
					onSelect={(type: string) => props.onSave?.({ ...props, type: type })}
				/>
			) : props.columns && props.rows ? (
				<Grid
					ItemComponent={WidgetComponent}
					columns={props.columns}
					rows={props.rows}
					onSaveGridItem={(item: GridItem) => {}}
					placerMode="NONE"
				>
					<WidgetComponent
						position={{ rowStart: 1, rowEnd: 5, colStart: 1, colEnd: 5 }}
					>
						<Barchart data={data} />
					</WidgetComponent>
				</Grid>
			) : null}
		</div>
	);
};

export default Widget;
