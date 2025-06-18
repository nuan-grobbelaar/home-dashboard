import { useEffect } from "react";
import type { WidgetPosition } from "./Widget";
import { useWidgetResizer } from "../../hooks/useWidgetResizer";

export interface FillerProps {
	key: any;
	row: number;
	column: number;
	handleMouseDown: (row: number, col: number, e: React.MouseEvent) => void;
}

const Filler = (props: FillerProps) => {
	return (
		<div
			className="widget-grid__filler"
			onMouseDown={(e: React.MouseEvent) =>
				props.handleMouseDown(props.row, props.column, e)
			}
		>
			{`[${props.row}, ${props.column}]`}
		</div>
	);
};

export default Filler;
