import { useEffect, useMemo, useState } from "react";
import {
	isDatasourceDataMap,
	isWidgetDatasourceDataResponse,
	type DatasourceDataMap,
	type SearchParameters,
	type WidgetDatasourceResponse,
	type WidgetDatasourceTypedDataResponse,
} from "../../hooks/firestore/types";
import InputContainer, { type SearchConfig } from "../input/InputContainer";
import OptionSelector from "../input/OptionSelector";

export interface BrowserItemField {
	name: string;
	format?: string;
}

export interface BrowserItemFormat {
	title: BrowserItemField;
	tag?: BrowserItemField;
	secondaryFields?: BrowserItemField[];
	expandedFields?: BrowserItemField[];
}

export interface BrowserProps {
	data: WidgetDatasourceResponse<unknown>;
	isMobile?: boolean;
	editMode?: boolean;
	formats: { [datasourceName: string]: BrowserItemFormat };
	search?: { [datasourceName: string]: SearchConfig };
	onSearch?: (
		datasourceName: string,
		query: SearchParameters,
		setError?: (err: React.ReactNode[]) => void
	) => void;
}

interface BrowserItemProps {
	format: BrowserItemFormat;
	data: DatasourceDataMap;
}

const FIELD_FORMAT_CURRENCY = "currency";
const FIELD_FORMAT_DATETIME = "datetime";

const formatField = (value: any, format: string) => {
	if (!value) return "";

	if (format == FIELD_FORMAT_CURRENCY) {
		return `€${value}`;
	} else if (format == FIELD_FORMAT_DATETIME) {
		console.log("todate", value);
		const date = new Date(value.seconds * 1000 + value.nanoseconds / 1e6);
		return date.toISOString().slice(0, 10);
	}

	console.error(`Field Format ${format} not defined`);
};

const BrowserItem = (props: BrowserItemProps) => {
	return (
		<div className="browser-item">
			<div className="browser-item__title-bar">
				<h2>{props.data.value[props.format.title.name]}</h2>
				{props.format.tag && (
					<span className="browser-item__title-bar__tag">
						{props.data.value[props.format.tag.name]}
					</span>
				)}
			</div>
			<div className="browser-item__secondary-item-container">
				<div className="browser-item__secondary-item-container__title">
					{props.format.secondaryFields &&
						props.format.secondaryFields.map((field) => (
							<div>{`${field.name}:`}</div>
						))}
				</div>
				<div className="browser-item__secondary-item-container__value">
					{props.format.secondaryFields &&
						props.format.secondaryFields.map((field) => (
							<div>
								{field.format
									? formatField(props.data.value[field.name], field.format)
									: props.data.value[field.name]}
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

const verifyData = (
	data: WidgetDatasourceResponse<unknown>
): WidgetDatasourceTypedDataResponse<DatasourceDataMap> => {
	console.log(data);
	if (isWidgetDatasourceDataResponse(data, isDatasourceDataMap)) return data;

	throw new Error("Data is wrong format"); //TODO: better handling
};

const Browser = (props: BrowserProps) => {
	console.log("query func", props.onSearch);
	const data = verifyData(props.data);

	const [selectedDatasource, setSelectedDatasource] = useState<string>();
	const [infoItems, setInfoItems] = useState<React.ReactNode[]>();
	const [errorItems, setErrorItems] = useState<React.ReactNode[]>();

	const datasources = useMemo(() => Object.keys(data), [data]);

	useEffect(() => {
		if (datasources.length == 1) setSelectedDatasource(datasources[0]);
	}, []);

	return (
		<div className="input_component">
			<InputContainer
				title={`Browse ${selectedDatasource}`}
				search={
					selectedDatasource && props.search
						? {
								...props.search[selectedDatasource],
								datasourceName: selectedDatasource,
						  }
						: undefined
				}
				onSearch={props.onSearch}
				expanded={!props.editMode}
				setInfoItems={setInfoItems}
				errorItems={errorItems}
				setErrorItems={setErrorItems}
			>
				{!selectedDatasource ? (
					<OptionSelector
						options={datasources}
						// onSelect={(option) => setType(option.type)}
					/>
				) : (
					<OptionSelector
						options={data[selectedDatasource]}
						displayCallback={(d) => (
							<BrowserItem
								data={d}
								format={props.formats[selectedDatasource]}
							/>
						)}
					>
						{errorItems}
						{infoItems}
					</OptionSelector>
				)}
			</InputContainer>
		</div>
	);
};

export default Browser;
