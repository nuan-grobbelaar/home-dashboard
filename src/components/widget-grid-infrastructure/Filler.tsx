export interface FillerProps {
	key: any;
	row: number;
	column: number;
	selected?: boolean;
	handleMouseDown: (filler: FillerProps, e: React.MouseEvent) => void;
	handleMouseEnter: (filler: FillerProps, e: React.MouseEvent) => void;
}

const Filler = (props: FillerProps) => {
	return (
		<div
			className="widget-grid__filler"
			data-selected={props.selected}
			onMouseDown={(e: React.MouseEvent) => props.handleMouseDown(props, e)}
			onMouseEnter={(e: React.MouseEvent) => props.handleMouseEnter(props, e)}
		>
			{/* {`[${props.row}, ${props.column}] ${props.selected ? "S" : ""}`} */}
		</div>
	);
};

export default Filler;
