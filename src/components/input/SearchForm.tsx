import {
	type InputField,
	type SearchParameters,
	type WidgetDatasourceResponse,
} from "../../hooks/firestore/types";
import InputForm from "./InputForm";
import type { SearchConfig } from "./InputContainer";
import { useEffect, useMemo } from "react";

export interface SearchFormProps {
	data: WidgetDatasourceResponse<unknown>;
	searchConfig: SearchConfig;
	onSearch: (
		datasourceName: string,
		query: SearchParameters,
		setError?: (err: React.ReactNode[]) => void
	) => void;
	formData: { [field: string]: any };
	setFormData: React.Dispatch<
		React.SetStateAction<{
			[field: string]: any;
		}>
	>;
	setError?: (err: React.ReactNode[]) => void;
}

export interface WhereClause {
	field: string;
	operator: ">" | ">=" | "==" | "<" | "<=";
	value: any;
}

const SearchForm = (props: SearchFormProps) => {
	const formData = useMemo(
		() => props.formData,
		[JSON.stringify(props.formData)]
	);

	const inputFieldMap = useMemo(
		() =>
			props.searchConfig.fields.reduce<{
				[field: string]: InputField;
			}>((agg, field, i) => {
				agg[field.id] = { type: field.type, order: i };
				return agg;
			}, {}),
		[props.searchConfig.fields]
	);

	console.log("searchform");

	useEffect(() => {
		const buildWhereClause = (
			fieldSearchConfig: (typeof props.searchConfig.fields)[number],
			value: any
		): WhereClause[] => {
			if (fieldSearchConfig.fieldName) {
				return [
					{
						field: fieldSearchConfig.fieldName,
						operator: fieldSearchConfig.operator,
						value,
					},
				];
			} else if (fieldSearchConfig.fieldNames) {
				return fieldSearchConfig.fieldNames.map((field) => ({
					field,
					operator: fieldSearchConfig.operator,
					value,
				}));
			}
			return [];
		};

		const searchParameters: SearchParameters = {
			where: Object.entries(formData).flatMap(([fieldId, storedValue]) => {
				const config = props.searchConfig.fields.find((f) => f.id === fieldId);
				if (!config) return [];
				return buildWhereClause(config, storedValue);
			}),
		};

		props.onSearch(
			props.searchConfig.datasourceName,
			searchParameters,
			props.setError
		);
	}, [formData]);

	return (
		<InputForm
			data={props.data}
			fields={inputFieldMap}
			controlledFormData={formData}
			controlledSetFormData={props.setFormData}
		/>
	);
};

export default SearchForm;
