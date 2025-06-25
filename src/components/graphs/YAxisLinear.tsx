import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type {
	CartesianGraphComponentProps,
	GraphComponentProps,
} from "./Graph";

export interface AxisYProps
	extends GraphComponentProps,
		CartesianGraphComponentProps {}

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

			g.append("text")
				.attr("text-anchor", "middle")
				.attr("transform", `translate(-50,${+props.height! / 2})rotate(-90)`)
				.classed("chart__y-axis__label", true)
				.text("income per capita, inflation-adjusted (dollars)");
		}
	}, [props.yScaleBand]);

	return <g ref={gRef} />;
};

export default YAxisLinear;
