import { useEffect, useRef, useState } from "react";
import type { GridItemPosition } from "../../hooks/grid/useGridItemPlacer";
import type {
	WidgetCreationData,
	WidgetDefinition,
} from "../../hooks/firestore/types";

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
					<div className="widget__select">
						{props.widgetDefinitions.map((option, i) => (
							<div
								className="widget__select__option"
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
						<div className="widget__select">
							{widgetDefinition.widgetComponentLayoutDefinitions.map(
								(option, i) => (
									<div
										className="widget__select__option"
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
					console.error("error");
				}
			}
		}
	}, [type, props.widgetDefinitions]);

	return content;
};

export default WidgetTypeSelect;
