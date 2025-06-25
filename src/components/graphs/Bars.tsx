import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type {
	CartesianGraphComponentProps,
	GraphComponentProps,
	GraphData,
} from "./Graph";

export interface BarsProps
	extends GraphComponentProps,
		CartesianGraphComponentProps {}

const Bars = (props: BarsProps) => {
	const gRef = useRef<SVGGElement>(null);

	useEffect(() => {
		console.log("graph update", "ref", gRef.current);

		if (
			gRef.current &&
			props.height &&
			props.data &&
			props.xScaleBand &&
			props.yScaleBand
		) {
			console.log("graph update", "xScaleBand:", props.xScaleBand);
			console.log("graph update", "yScaleBand:", props.yScaleBand);
			const g = d3
				.select(gRef.current)
				.selectAll<SVGRectElement, GraphData>("rect")
				.data(props.data, (d) => d.title)
				.join(
					(enter) =>
						enter
							.append("rect")
							.attr("x", (d) => props.xScaleBand!(d.title)!)
							.attr("width", props.xScaleBand!.bandwidth())
							.attr("y", () => props.yScaleBand!(0))
							.attr("height", 0)
							.attr("fill", (d) => d.color ?? "#fff")
							.classed("chart__barchart__bar", true)
							.call((sel) => {
								// Force reflow
								sel.nodes().forEach((node) => node.getBoundingClientRect());
								sel
									.attr("y", (d) => props.yScaleBand!(+d.value!))
									.attr(
										"height",
										(d) => +props.height! - props.yScaleBand!(+d.value!)
									);
							}),

					(update) =>
						update
							.attr("x", (d) => props.xScaleBand!(d.title)!)
							.attr("width", props.xScaleBand!.bandwidth())
							.attr("y", (d) => props.yScaleBand!(+d.value!))
							.attr(
								"height",
								(d) => +props.height! - props.yScaleBand!(+d.value!)
							)
							.attr("fill", (d) => d.color ?? "#fff"),

					(exit) => exit.remove()
				);
		}
	}, [
		props.data,
		props.height,
		props.width,
		props.xScaleBand,
		props.yScaleBand,
	]);

	return <g ref={gRef} />;
};

export default Bars;
