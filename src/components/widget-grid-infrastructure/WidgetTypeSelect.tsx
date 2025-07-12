import { useEffect, useRef, useState } from "react";
import type { GridItemPosition } from "../../hooks/grid/useGridItemPlacer";
import type {
	WidgetCreationData,
	WidgetDefinition,
} from "../../hooks/firestore/types";
import OptionSelector from "../input/OptionSelector";
import InputContainer from "../input/InputContainer";

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
					<InputContainer expanded>
						<OptionSelector
							options={props.widgetDefinitions}
							displayCallback={(option) => option.type}
							onSelect={(option) => setType(option.type)}
						/>
					</InputContainer>
				);
			} else {
				const widgetDefinition = props.widgetDefinitions.find(
					(wd) => wd.type === type
				);
				if (widgetDefinition) {
					setContent(
						<InputContainer expanded>
							<OptionSelector
								options={widgetDefinition.widgetComponentLayoutDefinitions}
								displayCallback={(option) => option.name}
								onSelect={(option) =>
									props.onSave({
										position: props.widgetPosition,
										type: type,
										...option,
									})
								}
							/>
						</InputContainer>
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
