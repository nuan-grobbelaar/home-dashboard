import type { PropsWithChildren } from "react";

export interface WidgetProps extends PropsWithChildren {
	colStart: number;
	rowStart: number;
	colEnd: number;
	rowEnd: number;
}

const Widget = (props: WidgetProps) => {
	return (
		<div
			className="widget-grid__widget"
			style={{
				gridArea: `${props.colStart} / ${props.rowStart} / ${props.colEnd} / ${props.rowEnd}`,
			}}
		>
			{props.children}
		</div>
	);
};

export default Widget;
