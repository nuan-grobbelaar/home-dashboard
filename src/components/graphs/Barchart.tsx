import type { GraphData } from "./Graph";
import Graph from "./Graph";
import XAxisScaling from "./XAxisScaling";
import YAxisLinear from "./YAxisLinear";
import GridLines from "./GridLines";
import Bars from "./Bars";

export interface BarchartProps {
	data: GraphData[];
	xAxisTitle?: string;
	yAxisTitle?: string;
}

const Barchart = (props: BarchartProps) => {
	return (
		<Graph
			data={props.data}
			margins={{
				left: props.yAxisTitle ? 20 : 0,
				bottom: props.xAxisTitle ? 20 : 0,
			}}
		>
			<XAxisScaling label={props.xAxisTitle} />
			<YAxisLinear label={props.yAxisTitle} />
			<GridLines />
			<Bars />
		</Graph>
	);
};

export default Barchart;
