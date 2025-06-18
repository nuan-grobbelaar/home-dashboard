import type { PropsWithChildren } from "react";

export interface WidgetProps extends PropsWithChildren {
	type?: string;
	position: WidgetPosition;
}

export interface WidgetPosition {
	colStart: number;
	rowStart: number;
	colEnd: number;
	rowEnd: number;
}

export const getWidgetId = (props: WidgetProps) => {
	return `${props.type}-${props.position.colStart}-${props.position.rowStart}-${props.position.colEnd}-${props.position.rowEnd}`;
};

const Widget = (props: WidgetProps) => {
	return (
		<div
			className="widget-grid__widget"
			style={{
				gridArea: `${props.position.colStart} / ${props.position.rowStart} / ${props.position.colEnd} / ${props.position.rowEnd}`,
			}}
		>
			{props.children}
		</div>
	);
};

export default Widget;
