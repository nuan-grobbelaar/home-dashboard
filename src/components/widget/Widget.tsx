import { type PropsWithChildren } from "react";

export interface WidgetProps extends WidgetData, PropsWithChildren {
	unsaved?: boolean;
	removeUnsavedWidget: () => void;
}

export interface WidgetPosition {
	colStart: number;
	rowStart: number;
	colEnd: number;
	rowEnd: number;
}

export interface WidgetData {
	type?: string;
	position: WidgetPosition;
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
			{props.unsaved && (
				<button className="close-button" onClick={props.removeUnsavedWidget}>
					x
				</button>
			)}
			{props.children}
		</div>
	);
};

export default Widget;
