import { useState } from "react";
import type { WidgetPosition, WidgetProps } from "../components/widget/Widget";

export function useWidgetResizer() {
	const [isDragging, setIsDragging] = useState(false);
	const [widget, setWidget] = useState<WidgetProps | null>(null);
	// const [position, setPosition] = useState({ x: 0, y: 0 });

	const addWidget = (widget: WidgetProps) => {
		console.log("mouseDown", "hook", widget);
		setWidget(widget);
	};

	const handleMouseDown = (row: number, col: number, e: React.MouseEvent) => {
		console.log("mouseDown", row, col);
		setIsDragging(true);
		addWidget({
			position: {
				rowStart: row,
				rowEnd: row + 1,
				colStart: col,
				colEnd: col + 1,
			},
		});
		e.preventDefault();
	};

	// const handleMouseMove = (e) => {
	// 	if (!isDragging) return;
	// 	setPosition({
	// 		x: e.clientX,
	// 		y: e.clientY,
	// 	});
	// };

	// const handleMouseEnter = (row: number, col: number) => {
	// 	if (isDragging) {
	// 		setEndCell({ row, col });
	// 	}
	// };

	// const handleMouseUp = () => {
	// 	if (isDragging) {
	// 		setIsDragging(false);
	// 		console.log("Drag ended at:", position);
	// 	}
	// };

	return { widget, handleMouseDown };
}
