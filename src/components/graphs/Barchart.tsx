import type { GraphData } from "./Graph";
import Graph from "./Graph";
import XAxisScaling from "./XAxisScaling";
import YAxisLinear from "./YAxisLinear";
import GridLines from "./GridLines";
import Bars from "./Bars";

export interface BarchartProps {
	data: GraphData[];
}

const Barchart = (props: BarchartProps) => {
	return (
		<Graph data={props.data}>
			<XAxisScaling />
			<YAxisLinear />
			<GridLines />
			<Bars />
		</Graph>
	);
};

export default Barchart;
