import { useMemo, useState, type PropsWithChildren } from "react";
import WidgetTypeSelect from "./WidgetTypeSelect";
import type { GridItem } from "../../hooks/useGridItemPlacer";
import Grid from "./Grid";
import WidgetComponent from "./WidgetComponent";
import {
	useWidgetStore,
	widgetComponentRegistry,
} from "../../hooks/useWidgetStore";
import type { WidgetData } from "../../hooks/useWidgetGridStore";

export interface WidgetProps extends WidgetData, GridItem, PropsWithChildren {}

export const getWidgetId = (props: WidgetProps) => {
	return `${props.type}-${props.position.colStart}-${props.position.rowStart}-${props.position.colEnd}-${props.position.rowEnd}`;
};

const Widget = (props: WidgetProps) => {
	const [_isLoading, setIsLoading] = useState(false);
	const isLoading = useMemo(
		() => _isLoading || props.isLoading,
		[_isLoading, props.isLoading]
	);
	const { widgetComponentLayout, widgetData } = useWidgetStore(
		props,
		setIsLoading
	);

	return (
		<div
			className="widget-grid__widget"
			data-unsaved={props.unsaved}
			style={{
				gridArea: `${props.position.colStart} / ${props.position.rowStart} / ${props.position.colEnd} / ${props.position.rowEnd}`,
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

			{isLoading ? (
				"Loading"
			) : props.unsaved && props.onSave && !isLoading ? (
				<WidgetTypeSelect
					widgetPosition={props.position}
					onSave={props.onSave}
				/>
			) : widgetComponentLayout?.columns && widgetComponentLayout?.rows ? (
				<Grid
					ItemComponent={WidgetComponent}
					columns={widgetComponentLayout?.columns}
					rows={widgetComponentLayout?.rows}
					onSaveGridItem={(item: GridItem) => {}}
					placerMode="NONE"
				>
					{widgetComponentLayout.components.map((component) => {
						const Component = widgetComponentRegistry[component.type];

						return (
							<WidgetComponent key={component.id} position={component.position}>
								{<Component data={widgetData} {...component.props} />}
							</WidgetComponent>
						);
					})}
				</Grid>
			) : null}
		</div>
	);
};

export default Widget;
