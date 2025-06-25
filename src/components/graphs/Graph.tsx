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
	value: string | number;
	color?: string;
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

export interface GraphProps extends PropsWithChildren {
	data: GraphData[];
}

const Graph = (props: GraphProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isTall, setIsTall] = useState(false);
	const [modifiedChildren, setModifiedChildren] = useState<ReactElement[]>([]);

	const margin = { top: 30, right: 30, bottom: 60, left: 60 },
		width = 500 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	useEffect(() => {
		if (containerRef.current) {
			setIsTall(
				containerRef.current.clientHeight > containerRef.current.clientWidth
			);
		}
	}, [containerRef]);

	useEffect(() => {
		const xScaleBand = d3
			.scaleBand()
			.range([0, width])
			.domain(props.data.map((d) => d.title))
			.padding(0.2);

		const yAxisMax = Math.max(...props.data.map((d) => +d.value!)) * 1.05;
		const yScaleBand = d3
			.scaleLinear()
			.domain([0, yAxisMax])
			.nice()
			.range([height, 0]);
		console.log("graph update", "setting x", xScaleBand);

		const childrenArray = React.Children.toArray(
			props.children
		) as ReactElement[];

		const children = childrenArray.map((child: ReactElement) => {
			const newProps: Record<string, any> = {};
			if (isValidElement(child)) {
				newProps["xScaleBand"] = xScaleBand;
				newProps["yScaleBand"] = yScaleBand;
				newProps["data"] = props.data;
				newProps["height"] = height;
				newProps["width"] = width;
			}

			return cloneElement(child as React.ReactElement<any>, newProps);
		});

		setModifiedChildren(children);
	}, [props.children, width, height]);

	return (
		<div className="chart" ref={containerRef}>
			<div
				style={{
					width: isTall ? "100%" : "auto",
					height: isTall ? "auto" : "100%",
				}}
			>
				<svg
					ref={svgRef}
					viewBox={`0 0 ${500} ${425}`}
					preserveAspectRatio="xMidYMid meet"
					style={{
						width: isTall ? "100%" : "auto",
						height: isTall ? "auto" : "100%",
					}}
				>
					<g
						className="chart-container"
						transform={`translate(${margin.left},${margin.top})`}
					>
						{modifiedChildren}
					</g>
				</svg>
			</div>
		</div>
	);
};

export default Graph;
