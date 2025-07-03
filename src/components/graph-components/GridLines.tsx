import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type {
	CartesianGraphComponentProps,
	GraphComponentProps,
} from "./Graph";

export interface GridLinesProps
	extends GraphComponentProps,
		CartesianGraphComponentProps {}

const GridLines = (props: GridLinesProps) => {
	const gRef = useRef<SVGGElement>(null);

	useEffect(() => {
		if (gRef.current && props.yScaleBand) {
			d3.select<SVGGElement, unknown>(gRef.current)
				.selectAll("line")
				.data(props.yScaleBand.ticks())
				.join("line")
				.attr("x1", 0)
				.attr("x2", +props.width!)
				.attr("y1", (d) => props.yScaleBand!(d))
				.attr("y2", (d) => props.yScaleBand!(d));
		}
	}, [props.data, props.height, props.width, props.yScaleBand]);

	return (
		<g
			ref={gRef}
			className="chart__grid-lines"
			// transform={`translate(0, ${props.height})`}
		/>
	);
};

export default GridLines;
