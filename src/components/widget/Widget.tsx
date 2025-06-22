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
	removeWidget?: (widgetId: string) => void;
	onWidgetTypeSelect?: (widget: WidgetData) => void;
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
			}}
		>
			{props.isLoading && "Loading"}
			{(props.unsaved || props.editMode) && (
				<button
					className="close-button"
					onClick={() => props.removeWidget?.(props.id) ?? undefined}
				>
					x
				</button>
			)}
			{props.unsaved && props.onWidgetTypeSelect && !props.isLoading && (
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
					onSelect={(type: string) =>
						props.onWidgetTypeSelect?.({
							id: props.id,
							position: props.position,
							type: type,
						})
					}
				/>
			)}
			{props.children}
		</div>
	);
};

export default Widget;
