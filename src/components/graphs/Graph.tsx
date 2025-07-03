import * as d3 from "d3";
import React, {
	useEffect,
	useRef,
	useState,
	isValidElement,
	type PropsWithChildren,
	type ReactElement,
	cloneElement,
} from "react";

export interface GraphData {
	title: string;
	value: string | number | { [key: string]: any };
	color?: string;
}

export function isGraphData(value: any): value is GraphData {
	return (
		value && typeof value === "object" && "title" in value && "value" in value
	);
}

export function isGraphDataArray(arr: any): arr is GraphData[] {
	return Array.isArray(arr) && arr.every(isGraphData);
}

export interface GraphComponentProps {
	data?: GraphData[];
	height?: number;
	width?: number;
}

export interface CartesianGraphComponentProps {
	xScaleBand?: d3.ScaleBand<string>;
	yScaleBand?: d3.ScaleLinear<number, number, never>;
}

export interface Margins {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
}

export interface GraphProps extends PropsWithChildren {
	data: GraphData[];
	margins?: Margins;
}

const Graph = ({ data, children, margins = {} }: GraphProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [modifiedChildren, setModifiedChildren] = useState<ReactElement[]>([]);

	const margin = {
		top: 30 + (margins.top ? margins.top : 0),
		right: 30 + (margins.right ? margins.right : 0),
		bottom: 50 + (margins.bottom ? margins.bottom : 0),
		left: 50 + (margins.left ? margins.left : 0),
	};
	const width = 500 - margin.left - margin.right;
	const height = 400 - margin.top - margin.bottom;

	useEffect(() => {
		const xScaleBand = d3
			.scaleBand()
			.range([0, width])
			.domain(data.map((d) => d.title))
			.padding(0.2);

		const yAxisMax =
			d3.max(data, (d) => {
				if (typeof d.value === "number") {
					return d.value * 1.05;
				} else if (typeof d.value === "object" && d.value !== null) {
					return (
						Object.values(d.value).reduce((sum, val) => sum + (+val || 0), 0) *
						1.05
					);
				} else {
					return 0;
				}
			}) ?? 0;

		const yScaleBand = d3
			.scaleLinear()
			.domain([0, yAxisMax])
			.nice()
			.range([height, 0]);

		const childrenArray = React.Children.toArray(children) as ReactElement[];

		const modChildren = childrenArray.map((child: ReactElement) => {
			const newProps: Record<string, any> = {};
			if (isValidElement(child)) {
				newProps["xScaleBand"] = xScaleBand;
				newProps["yScaleBand"] = yScaleBand;
				newProps["data"] = data;
				newProps["height"] = height;
				newProps["width"] = width;
			}

			return cloneElement(child as React.ReactElement<any>, newProps);
		});

		setModifiedChildren(modChildren);
	}, [children, width, height]);

	return (
		<svg
			ref={svgRef}
			className="chart"
			viewBox={`0 0 ${500} ${425}`}
			preserveAspectRatio="xMidYMid meet"
		>
			<g
				className="chart-container"
				transform={`translate(${margin.left},${margin.top})`}
			>
				{modifiedChildren}
			</g>
		</svg>
	);
};

export default Graph;
