import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type {
	CartesianGraphComponentProps,
	GraphComponentProps,
	GraphData,
} from "./Graph";

export interface StackedBarsProps
	extends GraphComponentProps,
		CartesianGraphComponentProps {
	groupColours: { [groupName: string]: string };
}

interface NormalizedData {
	title: string;
	[key: string]: any;
}

function normalizeStackedData(data: GraphData[]): Record<string, any>[] {
	const allKeys = new Set<string>();

	for (const d of data) {
		if (typeof d.value === "object" && d.value !== null) {
			Object.keys(d.value).forEach((k) => allKeys.add(k));
		}
	}

	return data.map((d) => {
		const row: Record<string, any> = { title: d.title };
		for (const key of allKeys) {
			row[key] = d.value && typeof d.value === "object" ? d.value[key] ?? 0 : 0;
		}
		return row;
	});
}

const StackedBars = (props: StackedBarsProps) => {
	const gRef = useRef<SVGGElement>(null);

	useEffect(() => {
		if (
			gRef.current &&
			props.height &&
			props.data &&
			props.xScaleBand &&
			props.yScaleBand
		) {
			const normalizedData = normalizeStackedData(props.data);

			const keys = Object.keys(normalizedData[0]).filter((k) => k !== "title");
			const stackGenerator = d3.stack().keys(keys);
			const stackedSeries = stackGenerator(normalizedData);

			const g = d3.select(gRef.current);

			const layers = g
				.selectAll<SVGGElement, d3.Series<NormalizedData, string>>("g.layer")
				.data(stackedSeries, (d) => d.key);

			layers
				.join(
					(enter) => enter.append("g").attr("class", "layer"),
					(update) => update,
					(exit) => exit.remove()
				)
				.each(function (layerData) {
					const key = layerData.key; // The stack category for this layer
					const groupColour = props.groupColours?.[key] ?? "#fff";

					const rects = d3
						.select(this)
						.selectAll<SVGRectElement, d3.SeriesPoint<NormalizedData>>("rect")
						.data(layerData, (d) => d.data.title);

					rects.join(
						(enter) =>
							enter
								.append("rect")
								.attr("x", (d) => props.xScaleBand!(String(d.data.title)) ?? 0)
								.attr("width", props.xScaleBand!.bandwidth())
								.attr("y", props.yScaleBand!(0))
								.attr("height", 0)
								.classed("chart__barchart__bar", true)
								.attr("fill", groupColour)
								// .on("mouseover", (event, d) => {
								// })
								// .on("mouseout", (event, d) => {
								// })
								.call((sel) => {
									// Force reflow for transition
									sel.nodes().forEach((node) => node.getBoundingClientRect());
									sel
										.transition()
										.duration(750)
										.attr("y", (d) => props.yScaleBand!(d[1]))
										.attr(
											"height",
											(d) => props.yScaleBand!(d[0]) - props.yScaleBand!(d[1])
										);
								}),

						(update) =>
							update
								.transition()
								.duration(750)
								.attr("x", (d) => props.xScaleBand!(String(d.data.title)) ?? 0)
								.attr("width", props.xScaleBand!.bandwidth())
								.attr("y", (d) => props.yScaleBand!(d[1]))
								.attr(
									"height",
									(d) => props.yScaleBand!(d[0]) - props.yScaleBand!(d[1])
								),

						(exit) =>
							exit
								.transition()
								.duration(750)
								.attr("y", props.yScaleBand!(0))
								.attr("height", 0)
								.remove()
					);
				});
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

export default StackedBars;
