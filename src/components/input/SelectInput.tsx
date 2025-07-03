import type { InputProps } from "./InputForm";

export interface SelectInputProps extends InputProps {
	options: Array<{ id: any; value: any; title: string }>;
}

const SelectInput = (props: SelectInputProps) => {
	return (
		<div className="input" data-hasValue={props.value && props.value != ""}>
			<label htmlFor={props.id}>{props.id}</label>
			<select
				name={props.id}
				value={props.value ? props.value : ""}
				onChange={(e) => props.onInputChange(props.id, e.target.value)}
			>
				<option value=""></option>
				{props.options &&
					props.options.map((option) => (
						<option key={option.id} value={option.value}>
							{option.title}
						</option>
					))}
			</select>
		</div>
	);
};

export default SelectInput;
