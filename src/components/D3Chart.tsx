import { useEffect, useRef, useState } from "react";

const D3Chart = ({
	chartRef,
}: {
	chartRef: React.RefObject<SVGSVGElement | null>;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isTall, setIsTall] = useState(false);

	useEffect(() => {
		if (containerRef.current) {
			setIsTall(
				containerRef.current.clientHeight > containerRef.current.clientWidth
			);
		}
	}, [containerRef]);

	return (
		<div className="chart" ref={containerRef}>
			<div
				style={{
					width: isTall ? "100%" : "auto",
					height: isTall ? "auto" : "100%",
				}}
			>
				<svg
					ref={chartRef}
					viewBox="0 0 460 400"
					preserveAspectRatio="xMidYMid meet"
					style={{
						width: isTall ? "100%" : "auto",
						height: isTall ? "auto" : "100%",
					}}
				/>
			</div>
		</div>
	);
};

export default D3Chart;
