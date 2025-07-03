import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type {
	CartesianGraphComponentProps,
	GraphComponentProps,
} from "./Graph";

export interface AxisYProps
	extends GraphComponentProps,
		CartesianGraphComponentProps {
	label?: string;
}

const YAxisLinear = (props: AxisYProps) => {
	const gRef = useRef<SVGGElement>(null);

	useEffect(() => {
		d3.select(gRef.current).classed("chart__y-axis", true);
	}, []);

	useEffect(() => {
		if (gRef.current && props.yScaleBand) {
			const g = d3.select<SVGGElement, unknown>(gRef.current);

			g.selectAll("*").remove();

			g.call(d3.axisLeft(props.yScaleBand));

			if (props.label) {
				g.append("text")
					.attr("text-anchor", "middle")
					.attr("transform", `translate(-60,${+props.height! / 2})rotate(-90)`)
					.classed("chart__y-axis__label", true)
					.text(props.label);
			}
		}
	}, [props.yScaleBand]);

	return <g ref={gRef} />;
};

export default YAxisLinear;
