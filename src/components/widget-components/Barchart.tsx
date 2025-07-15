import Graph, { isGraphDataArray } from "../graph-components/Graph";
import XAxisScaling from "../graph-components/XAxisScaling";
import YAxisLinear from "../graph-components/YAxisLinear";
import GridLines from "../graph-components/GridLines";
import Bars from "../graph-components/Bars";
import StackedBars from "../graph-components/StackedBars";
import {
	isDatasourceDataMap,
	isDatasourceDataNumber,
	isDatasourceDataString,
	isDatasourceDataStringOrUndefined,
	isWidgetDatasourceDataResponse,
	type DatasourceDataMap,
	type DatasourceDataNumber,
	type DatasourceDataString,
	type WidgetDatasourceResponse,
	type WidgetDatasourceTypedDataResponse,
} from "../../hooks/firestore/types";

export interface BarchartProps {
	data: WidgetDatasourceResponse<unknown>;
	xAxisLabel?: string;
	yAxisLabel?: string;
}

interface BarchartData {
	default: Array<DatasourceDataNumber | DatasourceDataMap>;
	colours: Array<DatasourceDataString>;
}

const verifyData = (data: WidgetDatasourceResponse<unknown>): BarchartData => {
	console.log(data);
	const defaultData = data["default"];
	if (
		!Array.isArray(defaultData) ||
		!(
			defaultData.every(isDatasourceDataNumber) ||
			defaultData.every(isDatasourceDataMap)
		)
	)
		throw new Error("Default datasource data is wrong format");

	const colourData = data["colours"];
	if (
		!Array.isArray(colourData) ||
		!colourData.every(isDatasourceDataStringOrUndefined)
	)
		throw new Error("Colour datasource data is wrong format"); //TODO: better handling

	return { default: defaultData, colours: colourData };
};

const Barchart = (props: BarchartProps) => {
	const { default: defaultDatasource, colours: coloursArray } = verifyData(
		props.data
	);

	console.log(coloursArray);

	const colours = coloursArray.reduce((agg, curr) => {
		agg[curr.title] = curr.value;
		return agg;
	}, {} as Record<string, string>);

	// if (!defaultDatasource) {
	// 	console.warn(`Default datasource not set`, props.data);
	// 	return null;
	// }

	// if (!isGraphDataArray(defaultDatasource))
	// 	throw new Error("Datasource does not contain GraphData"); //TODO: need better handling

	const graphData = defaultDatasource;

	console.log(props.data);

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
