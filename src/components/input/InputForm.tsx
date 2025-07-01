import { useState } from "react";
import type { Query } from "../../hooks/useWidgetDefinitionStore";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";

export interface InputFormProps {
	data: Query;
	insert: (data: { [field: string]: any }) => void;
}

export interface InputProps {
	id: string;
	value: any;
	onInputChange: (id: string, value: any) => void;
}

export type InputType = "text" | "number" | "select" | "timestamp";

export const widgetComponentRegistry: Record<
	InputType,
	React.ComponentType<any>
> = {
	text: TextInput,
	number: NumberInput,
	select: TextInput,
	timestamp: DateInput,
};

const InputForm = (props: InputFormProps) => {
	const [formData, setFormData] = useState<{ [field: string]: any }>({});

	const handleInputChange = (id: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		props.insert(formData);
		setFormData({});
	};

	return (
		<div className="input-form">
			<form className="input-form__form" onSubmit={handleSubmit}>
				{props.data.insert &&
					Object.entries(props.data.insert).map(([field, properties]) => {
						const FormInput = widgetComponentRegistry[properties.type];
						return (
							<FormInput
								id={field}
								onInputChange={handleInputChange}
								value={formData[field]}
							/>
						);
					})}

				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default InputForm;
