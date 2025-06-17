import type { PropsWithChildren } from "react";

export interface FillerProps {
	key: any;
	row: number;
	column: number;
}

const Filler = (props: FillerProps) => {
	return (
		<div className="widget-grid__filler">{`[${props.row}, ${props.column}]`}</div>
	);
};

export default Filler;
