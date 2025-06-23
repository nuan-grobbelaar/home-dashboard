import * as d3 from "d3";
import { useEffect, useRef } from "react";

const useBarchart = () => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const margin = { top: 30, right: 30, bottom: 70, left: 60 },
			width = 460 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		d3.select(svgRef.current).selectAll("*").remove();

		// Append svg to page
		const svg = d3
			.select(svgRef.current)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		d3.csv(
			"https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv"
		).then(function (data) {
			// X axis
			const x = d3
				.scaleBand()
				.range([0, width])
				.domain(data.map((d) => d.Country))
				.padding(0.2);
			svg
				.append("g")
				.attr("transform", `translate(0, ${height})`)
				.call(d3.axisBottom(x))
				.selectAll("text")
				.attr("transform", "translate(-15,10)rotate(-90)")
				.style("text-anchor", "end");

			// Y axis
			const y = d3.scaleLinear().domain([0, 13000]).range([height, 0]);
			svg.append("g").call(d3.axisLeft(y));

			// Bars
			svg
				.selectAll("mybar")
				.data(data)
				.join("rect")
				.attr("x", (d) => x(d.Country)!)
				.attr("y", (d) => y(+d.Value!))
				.attr("width", x.bandwidth())
				.attr("height", (d) => height - y(+d.Value!))
				.attr("fill", "#5f0f40");
		});
	}, []);

	return svgRef;
};

export default useBarchart;
