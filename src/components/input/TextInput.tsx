import type { InputProps } from "./InputForm";

export interface TextInputProps extends InputProps {}

const TextInput = (props: TextInputProps) => {
	return (
		<div className="input" data-hasValue={props.value && props.value != ""}>
			<label htmlFor={props.id}>{props.id}</label>
			<input
				name={props.id}
				type="text"
				value={props.value ? props.value : ""}
				onChange={(e) => props.onInputChange(props.id, e.target.value)}
			/>
		</div>
	);
};

export default TextInput;
