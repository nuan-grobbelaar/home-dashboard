import { useWidgetCreator } from "../../hooks/useWidgetCreator";

export interface FillerProps {
	key: any;
	row: number;
	column: number;
	selected?: boolean;
}

const Filler = (props: FillerProps) => {
	const { handleMouseDown, handleMouseEnter } = useWidgetCreator();

	return (
		<div
			className="widget-grid__filler"
			data-selected={props.selected}
			onMouseDown={(e: React.MouseEvent) => handleMouseDown(props, e)}
			onMouseEnter={(e: React.MouseEvent) => handleMouseEnter(props, e)}
		>
			{/* {`[${props.row}, ${props.column}] ${props.selected ? "S" : ""}`} */}
		</div>
	);
};

export default Filler;
