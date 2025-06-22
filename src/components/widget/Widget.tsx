import { type PropsWithChildren } from "react";
import WidgetTypeSelect from "./WidgetTypeSelect";
import type { GridItem, GridItemPosition } from "../../hooks/useGridItemPlacer";

export interface WidgetData {
	id?: any;
	type?: string;
	position: GridItemPosition;
}

export interface WidgetProps extends GridItem, PropsWithChildren {
	id?: any;
	type?: string;
	columns?: number;
	rows?: number;
}

export const getWidgetId = (props: WidgetProps) => {
	return `${props.type}-${props.position.colStart}-${props.position.rowStart}-${props.position.colEnd}-${props.position.rowEnd}`;
};

const Widget = (props: WidgetProps) => {
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
			) : (
				<div
					className="widget-grid__widget__grid"
					style={{
						gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
						gridTemplateRows: `repeat(${props.rows}, 1fr)`,
					}}
				>
					{props.children}
				</div>
			)}
		</div>
	);
};

export default Widget;
