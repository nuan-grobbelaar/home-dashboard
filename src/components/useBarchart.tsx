import * as d3 from "d3";
import { useEffect, useRef } from "react";

export interface BarchartData {
	title: string;
	value: string | number;
	color?: string;
}

const useBarchart = (data: BarchartData[]) => {
	const svgRef = useRef<SVGSVGElement>(null);

	const margin = { top: 30, right: 30, bottom: 70, left: 60 },
		width = 500 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	useEffect(() => {
		const svg = d3
			.select(svgRef.current)
			.append("g")
			.classed("barchart", true)
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// X axis group
		svg
			.append("g")
			.classed("barchart__x-axis", true)
			.attr("transform", `translate(0, ${height})`);

		// Y axis group
		svg.append("g").classed("barchart__y-axis", true);

		// Grid lines
		svg.append("g").classed("barchart__y-axis-grid-lines", true);
	}, []);

	useEffect(() => {
		const svg = d3.select(svgRef.current).select(".barchart");

		// X axis
		const x = d3
			.scaleBand()
			.range([0, width])
			.domain(data.map((d) => d.title))
			.padding(0.2);

		svg
			.select<SVGGElement>(".barchart__x-axis")
			.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-13,10)rotate(-90)");

		// Y axis
		const yAxisMax = Math.max(...data.map((d) => +d.value!)) * 1.05;
		const y = d3.scaleLinear().domain([0, yAxisMax]).nice().range([height, 0]);

		svg.select<SVGGElement>(".barchart__y-axis").call(d3.axisLeft(y));

		// Grid Lines
		svg
			.select<SVGGElement>(".barchart__y-axis-grid-lines")
			.selectAll("line")
			.data(y.ticks())
			.join("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", (d) => y(d))
			.attr("y2", (d) => y(d));

		svg
			.selectAll<SVGRectElement, BarchartData>("rect")
			.data(data, (d) => d.title)
			.join(
				(enter) =>
					enter
						.append("rect")
						.attr("x", (d) => x(d.title)!)
						.attr("width", x.bandwidth())
						.attr("y", y(0))
						.attr("height", 0)
						.attr("fill", (d) => d.color ?? "#fff")
						.classed("barchart__bar", true),

				(update) =>
					update
						.attr("x", (d) => x(d.title)!)
						.attr("width", x.bandwidth())
						.attr("y", (d) => y(+d.value!))
						.attr("height", (d) => height - y(+d.value!))
						.attr("fill", (d) => d.color ?? "#fff"),

				(exit) => exit.remove()
			);

		setTimeout(() => {
			svg
				.selectAll<SVGRectElement, BarchartData>("rect")
				.data(data, (d) => d.title)
				.attr("y", (d) => y(+d.value!))
				.attr("height", (d) => height - y(+d.value!));
		}, 100);
	}, [data]);

	return svgRef;
};

export default useBarchart;
