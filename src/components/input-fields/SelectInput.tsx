import { useRef, useState } from "react";
import type { InputProps } from "../widget-components/InputForm";
import PopupPortal from "./PopupPortal";
import ChevronUpIcon from "../../icons/ChevronUpIcon";
import ChevronDownIcon from "../../icons/ChevronDownIcon";

export interface SelectInputProps extends InputProps {
	options: Array<{ id: any; value: any; title: string }>;
}

const SelectInput = (props: SelectInputProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const onInputChange = (id: string, value: any) => {
		setDropdownOpen(false);
		props.onInputChange(id, value);
	};

	return (
		<>
			<div
				className="input"
				data-hasvalue={(props.value && props.value != "") || dropdownOpen}
				onClick={() => setDropdownOpen(!dropdownOpen)}
				ref={inputRef}
			>
				<label htmlFor={props.id}>{props.id}</label>
				<div className="input-select">
					<input
						name={props.id}
						type="text"
						value={props.value ? props.value : ""}
						readOnly
						// onChange={(e) => props.onInputChange(props.id, e.target.value)}
					/>
					<button className="action-button">
						{dropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
					</button>
				</div>
			</div>
			{inputRef && (
				<PopupPortal anchorRef={inputRef} visible={dropdownOpen}>
					{props.options &&
						props.options.map((option) => (
							<div
								key={option.title}
								className="input-select__option"
								onClick={() => onInputChange(props.id, option.value)}
							>
								{option.title}
							</div>
						))}
				</PopupPortal>
			)}
		</>
	);
};

export default SelectInput;
