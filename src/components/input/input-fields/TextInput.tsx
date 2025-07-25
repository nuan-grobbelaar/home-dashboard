import type { InputElementProps } from "../InputForm";

export interface TextInputProps extends InputElementProps {}

const TextInput = (props: TextInputProps) => {
	return (
		<div className="input" data-hasvalue={props.value && props.value != ""}>
			<label htmlFor={props.id}>{props.id}</label>
			<input
				className="input-text"
				name={props.id}
				type="text"
				value={props.value ? props.value : ""}
				onChange={(e) =>
					props.onInputChange(
						props.id,
						e.target.value !== "" ? e.target.value : null
					)
				}
			/>
		</div>
	);
};

export default TextInput;
