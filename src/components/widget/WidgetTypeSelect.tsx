import { useEffect, useRef, useState } from "react";
import { type WidgetDefinition } from "../../hooks/useWidgetDefinitionStore";
import type { WidgetCreationData } from "../../hooks/useWidgetGridStore";
import type { GridItemPosition } from "../../hooks/useGridItemPlacer";
import type { WidgetLoading } from "./Widget";

export interface WidgetTypeSelectProps {
	widgetDefinitions: WidgetDefinition[];
	widgetPosition: GridItemPosition;
	onSave: (widget: WidgetCreationData) => void;
}

const WidgetTypeSelect = (props: WidgetTypeSelectProps) => {
	const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

	const [content, setContent] = useState<React.ReactNode>();
	const [type, setType] = useState<string>();

	useEffect(() => {
		optionRefs.current.forEach((el) => {
			if (el) {
				if (el.scrollWidth > el.clientWidth) {
					el.classList.add("scroll-animate");
				}
			}
		});
	}, [props.widgetDefinitions]);

	useEffect(() => {
		if (props.widgetDefinitions && props.widgetDefinitions.length > 0) {
			if (!type) {
				setContent(
					<div className="widget__widget-type-select">
						{props.widgetDefinitions.map((option, i) => (
							<div
								className="widget__widget-type-select__option"
								onClick={() => setType(option.type)}
								ref={(el) => {
									optionRefs.current[i] = el;
								}}
							>
								{option.type}
							</div>
						))}
					</div>
				);
			} else {
				const widgetDefinition = props.widgetDefinitions.find(
					(wd) => wd.type === type
				);
				if (widgetDefinition) {
					setContent(
						<div className="widget__widget-type-select">
							{widgetDefinition.widgetComponentLayoutDefinitions.map(
								(option, i) => (
									<div
										className="widget__widget-type-select__option"
										onClick={() =>
											props.onSave({
												position: props.widgetPosition,
												type: type,
												...option,
											})
										}
										ref={(el) => {
											optionRefs.current[i] = el;
										}}
									>
										{option.name}
									</div>
								)
							)}
						</div>
					);
				} else {
					console.log("error");
				}
			}
		}
	}, [type, props.widgetDefinitions]);

	return content;
};

export default WidgetTypeSelect;
