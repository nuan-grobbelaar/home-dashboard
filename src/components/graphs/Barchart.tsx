import type { GraphData } from "./Graph";
import Graph from "./Graph";
import XAxisScaling from "./XAxisScaling";
import YAxisLinear from "./YAxisLinear";
import GridLines from "./GridLines";
import Bars from "./Bars";

export interface BarchartProps {
	data: GraphData[];
	xAxisLabel?: string;
	yAxisLabel?: string;
}

const Barchart = (props: BarchartProps) => {
	return (
		<Graph
			data={props.data}
			margins={{
				left: props.yAxisLabel ? 20 : 0,
				bottom: props.xAxisLabel ? 20 : 0,
			}}
		>
			<XAxisScaling label={props.xAxisLabel} />
			<YAxisLinear label={props.yAxisLabel} />
			<GridLines />
			<Bars />
		</Graph>
	);
};

export default Barchart;
