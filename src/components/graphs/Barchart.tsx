import type { GraphData } from "./Graph";
import Graph from "./Graph";
import XAxisScaling from "./XAxisScaling";
import YAxisLinear from "./YAxisLinear";
import GridLines from "./GridLines";
import Bars from "./Bars";
import StackedBars from "./StackedBars";

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
			{props.data.find(
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
