import { useState } from "react";
import {
	isDatasourceDataMap,
	isInsertQuery,
	isWidgetDatasourceDataResponse,
	type DatasourceDataMap,
	type InsertQuery,
	type WidgetDatasourceDataResponse,
	type WidgetDatasourceResponse,
	type WidgetDatasourceTypedDataResponse,
} from "../../hooks/firestore/types";

export interface BrowsertProps {
	data: WidgetDatasourceResponse<unknown>;
	isMobile?: boolean;
}

const verifyData = (
	data: WidgetDatasourceResponse<unknown>
): WidgetDatasourceTypedDataResponse<DatasourceDataMap> => {
	console.log(data);
	if (isWidgetDatasourceDataResponse(data, isDatasourceDataMap)) return data;

	throw new Error("Data is wrong format"); //TODO: better handling
};

const Browser = (props: BrowsertProps) => {
	const data = verifyData(props.data);

	return (
		<div className="input_component">
			{Object.entries(data).map(([k, values]) => {
				console.log(k, values);
				return values.map((d) =>
					Object.entries(d.value).map(([k, v]) => <span>{"" + v}</span>)
				);
			})}
		</div>
	);
};

export default Browser;
