import { useEffect, useRef } from "react";

export interface WidgetTypeSelectProps {
	options: any[];
	onSelect: (option: any) => void;
}

const WidgetTypeSelect = (props: WidgetTypeSelectProps) => {
	const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		optionRefs.current.forEach((el) => {
			if (el) {
				if (el.scrollWidth > el.clientWidth) {
					el.classList.add("scroll-animate");
				}
			}
		});
	}, [props.options]);

	return (
		<div className="widget__widget-type-select">
			{props.options.map((option, i) => (
				<div
					className="widget__widget-type-select__option"
					onClick={() => props.onSelect(option)}
					ref={(el) => {
						optionRefs.current[i] = el;
					}}
				>
					{option}
				</div>
			))}
		</div>
	);
};

export default WidgetTypeSelect;
