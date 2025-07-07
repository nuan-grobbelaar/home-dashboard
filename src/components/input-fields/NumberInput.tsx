import type { InputElementProps } from "../widget-components/InputForm";

export interface NumberInputProps extends InputElementProps {}

const NumberInput = (props: NumberInputProps) => {
	return (
		<div className="input" data-hasvalue={props.value && props.value != ""}>
			<label htmlFor={props.id}>{props.id}</label>
			<input
				className="input-text"
				name={props.id}
				type="number"
				step=".01"
				value={props.value ? props.value : ""}
				onChange={(e) => props.onInputChange(props.id, e.target.value)}
			/>
		</div>
	);
};

export default NumberInput;
