import type { InputProps } from "../widget-components/InputForm";

export interface TextInputProps extends InputProps {}

const TextInput = (props: TextInputProps) => {
	return (
		<div className="input" data-hasvalue={props.value && props.value != ""}>
			{props.label && <label htmlFor={props.id}>{props.id}</label>}
			<input
				className="input-text"
				name={props.id}
				type="text"
				value={props.value ? props.value : ""}
				onChange={(e) => props.onInputChange(props.id, e.target.value)}
			/>
		</div>
	);
};

export default TextInput;
