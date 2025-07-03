import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type {
	CartesianGraphComponentProps,
	GraphComponentProps,
} from "./Graph";

export interface XAxisScaling
	extends GraphComponentProps,
		CartesianGraphComponentProps {
	label?: string;
}

const XAxisScaling = (props: XAxisScaling) => {
	const gRef = useRef<SVGGElement>(null);

	useEffect(() => {
		if (gRef.current && props.xScaleBand) {
			const g = d3.select<SVGGElement, unknown>(gRef.current);

			g.selectAll("*").remove();

			g.call(d3.axisBottom(props.xScaleBand));

			g.selectAll(".tick text")
				.attr("text-anchor", "end")
				.attr("transform", "translate(-15,10)rotate(-90)");

			if (props.label) {
				g.append("text")
					.attr("text-anchor", "middle")
					.attr("transform", `translate(${props.width! / 2},60)`) //TODO: the needs to translate down to account for x ticks
					.classed("chart__x-axis__label", true)
					.text(props.label);
			}
		}
	}, [props.data, props.xScaleBand]);

	return (
		<g
			ref={gRef}
			className="chart__x-axis"
			transform={`translate(0, ${props.height})`}
		/>
	);
};

export default XAxisScaling;
