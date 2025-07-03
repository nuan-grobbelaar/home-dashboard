import { useState } from "react";
import TextInput from "../input-fields/TextInput";
import NumberInput from "../input-fields/NumberInput";
import DateInput from "../input-fields/DateInput";
import SelectInput from "../input-fields/SelectInput";
import {
	isInsertQuery,
	type InsertQuery,
	type WidgetDatasourceQueryResponseData,
} from "../../hooks/firestore/types";

export interface InputFormProps {
	data: WidgetDatasourceQueryResponseData;
	insert: (data: { [field: string]: any }) => void;
}

export interface InputProps {
	id: string;
	value: any;
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
	const defaultDatasource = props.data["default"];

	if (!defaultDatasource) throw new Error("Default datasource not set"); //TODO: need better handling

	if (!isInsertQuery(defaultDatasource))
		throw new Error("Datasource not a query"); //TODO: need better handling

	const insertQuery: InsertQuery = defaultDatasource;

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
			<form
				className="input-form__form"
				onSubmit={handleSubmit}
				autoComplete="off"
			>
				{insertQuery.insert &&
					Object.entries(insertQuery.insert).map(([field, properties]) => {
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

				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default InputForm;
