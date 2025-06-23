import D3Chart from "./D3Chart";
import useBarchart from "./useBarchart";
import WidgetComponent from "./widget/WidgetComponent";

const Barchart = () => {
	const barchartRef = useBarchart();
	console.log("barchart");

	return <D3Chart chartRef={barchartRef} />;
};

export default Barchart;
