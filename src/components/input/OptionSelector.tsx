import { useEffect, useRef, type PropsWithChildren } from "react";

export interface OptionSelectorProps extends PropsWithChildren {
	options: any[];
	onSelect?: (option: any) => void;
	displayCallback?: (option: any) => void;
}

const OptionSelector = (props: OptionSelectorProps) => {
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
		<>
			{props.children}
			{props.options.map((option, i) => (
				<div
					key={i}
					className="option-selector__option"
					onClick={() => (props.onSelect ? props.onSelect(option) : () => {})}
					ref={(el) => {
						optionRefs.current[i] = el;
					}}
				>
					{props.displayCallback ? props.displayCallback(option) : option}
				</div>
			))}
		</>
	);
};

export default OptionSelector;
