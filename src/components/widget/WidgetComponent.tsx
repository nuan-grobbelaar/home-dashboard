import type { PropsWithChildren } from "react";
import type { GridItem } from "../../hooks/useGridItemPlacer";

export interface WidgetComponentProps extends GridItem, PropsWithChildren {
	id?: any;
	type?: string;
	columns?: number; //TODO: why do these have to be generic?
	rows?: number;
}

const WidgetComponent = (props: WidgetComponentProps) => {
	return (
		<div
			data-unsaved={props.unsaved}
			style={{
				gridArea: `${props.position.colStart} / ${props.position.rowStart} / ${props.position.colEnd} / ${props.position.rowEnd}`,
			}}
		>
			{props.children}
		</div>
	);
};

export default WidgetComponent;
