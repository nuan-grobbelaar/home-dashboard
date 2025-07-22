import { useState } from "react";
import TextInput from "./input-fields/TextInput";
import NumberInput from "./input-fields/NumberInput";
import DateInput, { formatDateValue } from "./input-fields/DateInput";
import SelectInput from "./input-fields/SelectInput";
import {
	type InputField,
	type WidgetDatasourceResponse,
} from "../../hooks/firestore/types";

export interface InputFormProps {
	data?: WidgetDatasourceResponse<unknown>;
	fields: { [field: string]: InputField };
	onSubmit?: (data: { [field: string]: any }) => void;
	handleInputChange?: (id: string, value: string) => void;
	postSubmit?: () => void;
	controlledFormData?: { [field: string]: any };
	controlledSetFormData?: React.Dispatch<
		React.SetStateAction<{
			[field: string]: any;
		}>
	>;
}

export interface InputElementProps {
	id: string;
	value: any;
	label?: boolean;
	onInputChange: (id: string, value: any) => void;
	initialValue: any | undefined;
}

export type InputType = "text" | "number" | "select" | "datetime";

export const inputRegistry: Record<InputType, React.ComponentType<any>> = {
	text: TextInput,
	number: NumberInput,
	select: SelectInput,
	datetime: DateInput,
};

export const formatFormValue = (value: any, type: InputType) => {
	if (type === "datetime") return formatDateValue(value);
	else return value;
};

const InputForm = (props: InputFormProps) => {
	const [_formData, _setFormData] = useState<{ [field: string]: any }>({});

	const formData =
		props.controlledFormData && props.controlledSetFormData
			? props.controlledFormData
			: _formData;

	const setFormData =
		props.controlledFormData && props.controlledSetFormData
			? props.controlledSetFormData
			: _setFormData;

	const handleInputChange = (id: string, value: any) => {
		setFormData((prev) => {
			const updated = { ...prev };

			if (value === null || value === undefined) {
				delete updated[id];
			} else {
				updated[id] = typeof value === "string" ? value.toLowerCase() : value;
			}

			return updated;
		});

		if (props.handleInputChange) props.handleInputChange(id, value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (props.onSubmit) {
			props.onSubmit(formData);
			setFormData({});
			if (props.postSubmit) props.postSubmit();
		}
	};

	return (
		<div className="input-form">
			<form
				className="input-form__form"
				onSubmit={handleSubmit}
				autoComplete="off"
			>
				{Object.entries(props.fields)
					.sort(([_a, { order: orderA }], [_b, { order: orderB }]) =>
						orderA && orderB ? orderA - orderB : 0
					)
					.map(([field, properties]) => {
						const FormInput = inputRegistry[properties.type];
						const options =
							properties.type == "select" && props.data && properties.datasource
								? props.data[properties.datasource]
								: null;

						console.log("input form", properties);

						return (
							<FormInput
								key={field}
								id={field}
								onInputChange={handleInputChange}
								options={options}
								initialValue={
									properties.initialValue && properties.type == "datetime"
										? new Date()
										: undefined
								}
								value={formData[field]}
							/>
						);
					})}

				{props.onSubmit && (
					<button
						type="submit"
						className="button input-form__form-submit-button"
					>
						Submit
					</button>
				)}
			</form>
		</div>
	);
};

export default InputForm;
