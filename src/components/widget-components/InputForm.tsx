import { useMemo, useState } from "react";
import TextInput from "../input-fields/TextInput";
import NumberInput from "../input-fields/NumberInput";
import DateInput from "../input-fields/DateInput";
import SelectInput from "../input-fields/SelectInput";
import {
	type InsertQuery,
	type WidgetDatasourceQueryResponseData,
} from "../../hooks/firestore/types";

export interface InputFormProps {
	data: WidgetDatasourceQueryResponseData;
	insertQuery: InsertQuery;
	insert: (data: { [field: string]: any }) => void;
}

export interface InputElementProps {
	id: string;
	value: any;
	label?: boolean;
	onInputChange: (id: string, value: any) => void;
}

export type InputType = "text" | "number" | "select" | "datetime";

export const widgetComponentRegistry: Record<
	InputType,
	React.ComponentType<any>
> = {
	text: TextInput,
	number: NumberInput,
	select: SelectInput,
	datetime: DateInput,
};

const InputForm = (props: InputFormProps) => {
	const getFormValidationInitialData = () => {
		return Object.entries(props.insertQuery.insert).reduce<{
			[field: string]: { valid: boolean; reason?: string };
		}>((agg, [field, properties]) => {
			agg[field] = properties.required
				? { valid: false, reason: "field not set" }
				: { valid: true };
			return agg;
		}, {});
	};

	const [formData, setFormData] = useState<{ [field: string]: any }>({});
	const [formValidation, setFormValidation] = useState<{
		[field: string]: { valid: boolean; reason?: string };
	}>(getFormValidationInitialData());

	const handleInputChange = (id: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));

		setFormValidation((prev) => ({
			...prev,
			[id]: { valid: !!value }, //TODO: fix for empty strings
		}));
	};

	const inputsValid = useMemo(() => {
		return !Object.values(formValidation).some(({ valid }) => !valid);
	}, [formValidation]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputsValid) {
			console.log("submitting");
			props.insert(formData);
			setFormData({});
			setFormValidation(getFormValidationInitialData());
		}
	};

	console.log("inputs", props.insertQuery.insert);

	return (
		<div className="input-form">
			<form
				className="input-form__form"
				onSubmit={handleSubmit}
				autoComplete="off"
			>
				{props.insertQuery.insert &&
					Object.entries(props.insertQuery.insert)
						.sort(([_a, { order: orderA }], [_b, { order: orderB }]) =>
							orderA && orderB ? orderA - orderB : 0
						)
						.map(([field, properties]) => {
							const FormInput = widgetComponentRegistry[properties.type];
							const options =
								properties.type == "select" && properties.datasource
									? props.data[properties.datasource]
									: null;

							return (
								<FormInput
									key={field}
									id={field}
									onInputChange={handleInputChange}
									options={options}
									value={formData[field]}
								/>
							);
						})}

				<button type="submit" className="input-form__form-submit-button">
					Submit
				</button>
			</form>
		</div>
	);
};

export default InputForm;
