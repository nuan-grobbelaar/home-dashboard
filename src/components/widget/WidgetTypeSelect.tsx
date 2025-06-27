import { useEffect, useRef, useState } from "react";
import {
	useWidgetDefinitionStore,
	type WidgetComponentLayoutDefinition,
	type WidgetDefinition,
} from "../../hooks/useWidgetDefinitionStore";
import type {
	WidgetCreationData,
	WidgetData,
} from "../../hooks/useWidgetGridStore";
import type { GridItemPosition } from "../../hooks/useGridItemPlacer";
import { doc } from "firebase/firestore";

export interface WidgetTypeSelectProps {
	widgetPosition: GridItemPosition;
	onSave: (widget: WidgetCreationData) => void;
}

const WidgetTypeSelect = (props: WidgetTypeSelectProps) => {
	const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [content, setContent] = useState<React.ReactNode>();
	const [type, setType] = useState<string>();

	const { widgetDefinitions } = useWidgetDefinitionStore(true, setIsLoading);

	useEffect(() => {
		optionRefs.current.forEach((el) => {
			if (el) {
				if (el.scrollWidth > el.clientWidth) {
					el.classList.add("scroll-animate");
				}
			}
		});
	}, [widgetDefinitions]);

	useEffect(() => {
		if (isLoading) setContent(<div>Loading</div>);
		else if (widgetDefinitions && widgetDefinitions.length > 0) {
			if (!type) {
				setContent(
					widgetDefinitions.map((option, i) => (
						<div
							className="widget__widget-type-select__option"
							onClick={() => setType(option.type)}
							ref={(el) => {
								optionRefs.current[i] = el;
							}}
						>
							{option.type}
						</div>
					))
				);
			} else {
				const widgetDefinition = widgetDefinitions.find(
					(wd) => wd.type === type
				);
				if (widgetDefinition) {
					setContent(
						widgetDefinition.widgetComponentLayoutDefinitions.map(
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
						)
					);
				} else {
					console.log("error");
				}
			}
		}
	}, [isLoading, type]);

	return <div className="widget__widget-type-select">{content}</div>;
};

export default WidgetTypeSelect;
