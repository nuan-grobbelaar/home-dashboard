import { useEffect, useState } from "react";
import D3Chart from "./D3Chart";
import useBarchart from "./useBarchart";

const Barchart = () => {
	const [data, setData] = useState([
		{ title: "jan", value: 10000, color: "#80ff80" },
		{ title: "feb", value: 9500, color: "#ffff80" },
		{ title: "mar", value: 8000, color: "#80ffff" },
		{ title: "apr", value: 6000, color: "#ff8080" },
		{ title: "may", value: 7500, color: "#8080ff" },
		{ title: "jun", value: 7200, color: "#ffb380" },
		{ title: "jul", value: 8500, color: "#b380ff" },
		{ title: "aug", value: 8700, color: "#80ffbf" },
		{ title: "sep", value: 7900, color: "#ff80df" },
		{ title: "oct", value: 8800, color: "#aaff80" },
		{ title: "nov", value: 9400, color: "#80d4ff" },
		{ title: "dec", value: 545, color: "#ffd480" },
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setData([
				{ title: "jan", value: 8000, color: "#80ff80" },
				{ title: "feb", value: 9600, color: "#ffff80" },
				{ title: "mar", value: 8020, color: "#80ffff" },
				{ title: "apr", value: 7000, color: "#ff8080" },
				{ title: "may", value: 7501, color: "#8080ff" },
				{ title: "jun", value: 7400, color: "#ffb380" },
				{ title: "jul", value: 8600, color: "#b380ff" },
				{ title: "aug", value: 8750, color: "#80ffbf" },
				{ title: "sep", value: 8000, color: "#ff80df" },
				{ title: "oct", value: 9100, color: "#aaff80" },
				{ title: "nov", value: 9500, color: "#80d4ff" },
				{ title: "dec", value: 6000, color: "#ffd480" },
			]);
		}, 3000);
		return () => clearTimeout(timer);
	}, []);

	const barchartRef = useBarchart(data);
	console.log("barchart");

	return <D3Chart chartRef={barchartRef} />;
};

export default Barchart;
