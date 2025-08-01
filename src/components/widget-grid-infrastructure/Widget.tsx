import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import WidgetTypeSelect from "./WidgetTypeSelect";
import type { GridItem } from "../../hooks/grid/useGridItemPlacer";
import Grid from "./Grid";
import WidgetComponent from "./WidgetComponent";
import {
	useWidgetStore,
	widgetComponentRegistry,
} from "../../hooks/firestore/useWidgetStore";
import { useWidgetDefinitionStore } from "../../hooks/firestore/useWidgetDefinitionStore";
import LoadingBar from "./LoadingBar";
import type { WidgetDocument } from "../../hooks/firestore/types";

export interface WidgetProps
	extends WidgetDocument,
		GridItem,
		PropsWithChildren {
	setError?: (error: String | null) => void;
}

export interface LoadingState {
	isLoading: boolean;
	message?: string;
}

export const getWidgetId = (props: WidgetProps) => {
	return `${props.type}-${props.position.colStart}-${props.position.rowStart}-${props.position.colEnd}-${props.position.rowEnd}`;
};

const Widget = (props: WidgetProps) => {
	const [loading, setLoading] = useState<LoadingState>({
		isLoading: !!props.isLoading,
	});
	const isLoading = useMemo(() => {
		if (props.isLoading?.isLoading && props.isLoading?.message)
			return { isLoading: true, message: props.isLoading?.message };
		else return loading;
	}, [loading, props.isLoading]);

	const {
		widgetComponentLayout,
		widgetData,
		insertIntoWidgetDatasource,
		loadWidgetDataFromDatasource,
	} = useWidgetStore(props, setLoading, props.setError);

	const { loadWidgetDefinitions, widgetDefinitions } = useWidgetDefinitionStore(
		false,
		setLoading,
		props.setError
	);

	useEffect(() => {
		if (
			props.unsaved &&
			props.onSave &&
			(!widgetDefinitions || widgetDefinitions.length === 0)
		) {
			loadWidgetDefinitions();
		}
	}, []);

	return (
		<div
			className="widget-grid__widget"
			data-unsaved={props.unsaved}
			style={{
				gridArea: `${props.position.colStart} / ${props.position.rowStart} / ${props.position.colEnd} / ${props.position.rowEnd}`,
				aspectRatio:
					(props.position.colEnd - props.position.colStart) /
					(props.position.rowEnd - props.position.rowStart),
			}}
		>
			{(props.unsaved || props.editMode) && (
				<button
					className="button close-button"
					onClick={() => props.removeItem?.(props.id) ?? undefined}
				>
					x
				</button>
			)}

			{isLoading.isLoading ? (
				<div className="widget__loading">
					<LoadingBar message={isLoading.message} />
				</div>
			) : props.unsaved &&
			  props.onSave &&
			  widgetDefinitions &&
			  widgetDefinitions.length > 0 ? (
				<WidgetTypeSelect
					widgetDefinitions={widgetDefinitions}
					widgetPosition={props.position}
					onSave={props.onSave}
				/>
			) : widgetComponentLayout?.columns && widgetComponentLayout?.rows ? (
				<Grid
					ItemComponent={WidgetComponent}
					columns={widgetComponentLayout?.columns}
					rows={widgetComponentLayout?.rows}
					onSaveGridItem={() => {}}
					placerMode="NONE"
				>
					{widgetComponentLayout.components.map((component) => {
						const Component = widgetComponentRegistry[component.type];
						if (!Component) {
							props.setError?.(
								`Widget Component "${component.type}" not defined`
							);
						}
						const componentProps = component.props ? component.props : { t: 1 };
						return (
							<WidgetComponent key={component.id} position={component.position}>
								{
									<Component
										data={widgetData}
										insert={insertIntoWidgetDatasource}
										isMobile={props.isMobile}
										editMode={props.editMode}
										onSearch={loadWidgetDataFromDatasource}
										{...componentProps}
									/>
								}
							</WidgetComponent>
						);
					})}
				</Grid>
			) : null}
		</div>
	);
};

export default Widget;
