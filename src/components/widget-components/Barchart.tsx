import Graph, { isGraphDataArray } from "../graph-components/Graph";
import XAxisScaling from "../graph-components/XAxisScaling";
import YAxisLinear from "../graph-components/YAxisLinear";
import GridLines from "../graph-components/GridLines";
import Bars from "../graph-components/Bars";
import StackedBars from "../graph-components/StackedBars";
import type { WidgetDatasourceQueryResponseData } from "../../hooks/firestore/types";

export interface BarchartProps {
	data: WidgetDatasourceQueryResponseData;
	xAxisLabel?: string;
	yAxisLabel?: string;
}

const Barchart = (props: BarchartProps) => {
	const defaultDatasource = props.data["default"];
	const coloursArray = props.data["colours"] as Array<{ [key: string]: any }>;

	const colours = coloursArray.reduce((agg, curr) => {
		agg[curr.title] = curr.value;
		return agg;
	}, {});

	if (!defaultDatasource) {
		console.warn(`Default datasource not set`, props.data);
		return null;
	}

	if (!isGraphDataArray(defaultDatasource))
		throw new Error("Datasource does not contain GraphData"); //TODO: need better handling

	const graphData = defaultDatasource;

	return (
		<Graph
			data={graphData}
			margins={{
				left: props.yAxisLabel ? 20 : 0,
				bottom: props.xAxisLabel ? 20 : 0,
			}}
		>
			<XAxisScaling label={props.xAxisLabel} />
			<YAxisLinear label={props.yAxisLabel} />
			<GridLines />
			{graphData.find(
				(d) => typeof d.value === "object" && d.value !== null
			) ? (
				<StackedBars groupColours={colours} />
			) : (
				<Bars groupColours={colours} />
			)}
		</Graph>
	);
};

export default Barchart;
