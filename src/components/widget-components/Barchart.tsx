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
				<StackedBars
					groupColours={{
						groceries: "#a8d5ba",
						rent: "#f7c8c8",
						pets: "#fce4b5",
						entertainment: "#cbb4d4",
						transport: "#bcdffb",
						utilities: "#f9d6ac",
						toys: "#b3e3dc",
					}}
				/>
			) : (
				<Bars
					groupColours={{
						groceries: "#a8d5ba",
						rent: "#f7c8c8",
						pets: "#fce4b5",
						entertainment: "#cbb4d4",
						transport: "#bcdffb",
						utilities: "#f9d6ac",
						toys: "#b3e3dc",
					}}
				/>
			)}
		</Graph>
	);
};

export default Barchart;
