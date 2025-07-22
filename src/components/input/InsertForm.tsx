import { useMemo, useState } from "react";
import {
	type InsertQuery,
	type WidgetDatasourceResponse,
} from "../../hooks/firestore/types";
import InputForm from "./InputForm";

export interface InsertFormProps {
	data: WidgetDatasourceResponse<unknown>;
	insertQuery: InsertQuery;
	insert: (data: { [field: string]: any }) => void;
}

const InsertForm = (props: InsertFormProps) => {
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

	const [formValidation, setFormValidation] = useState<{
		[field: string]: { valid: boolean; reason?: string };
	}>(getFormValidationInitialData());

	const handleInputChange = (id: string, value: string) => {
		setFormValidation((prev) => ({
			...prev,
			[id]: { valid: !!value }, //TODO: fix for empty strings
		}));
	};

	const inputsValid = useMemo(() => {
		return !Object.values(formValidation).some(({ valid }) => !valid);
	}, [formValidation]);

	console.log("inputs", props.insertQuery.insert);

	return (
		<InputForm
			data={props.data}
			fields={props.insertQuery.insert}
			onSubmit={inputsValid ? props.insert : () => {}}
			postSubmit={() => setFormValidation(getFormValidationInitialData())}
			handleInputChange={handleInputChange}
		/>
	);
};

export default InsertForm;
