import type { DocumentReference } from "firebase/firestore";
import type { GridItem, GridItemPosition } from "../grid/useGridItemPlacer";
import type { InputType } from "../../components/input/InputForm";

export interface WidgetLayoutDocument {
	id?: any;
	rows: number;
	columns: number;
	widgets: Array<WidgetDocument>;
}

export interface WidgetDatasourceDocument {
	datasource?: DocumentReference;
	datasourceQuery?: Query;
}

export interface WidgetDocument {
	id?: any;
	dbRef?: DocumentReference;
	type?: string;
	componentLayoutRef?: DocumentReference;
	position: GridItemPosition;
	datasources: { [datasourceName: string]: WidgetDatasourceDocument };
}

export type WidgetCreationData = WidgetComponentLayoutDefinitionDocument &
	GridItem & {
		type: string;
	};

export type ComponentName = "barchart" | "input" | "browser";

export interface WidgetComponentDocument {
	id: string;
	type: ComponentName;
	position: {
		rowStart: number;
		rowEnd: number;
		colStart: number;
		colEnd: number;
	};
	componentReference: DocumentReference;
	props: { [key: string]: any };
}

export function isQuery(value: any): value is Query {
	return (
		value &&
		typeof value === "object" &&
		("insert" in value || "target" in value)
	);
}

export function isInsertQuery(value: any): value is InsertQuery {
	return value && typeof value === "object" && "insert" in value;
}

export interface WidgetComponentLayoutDocument {
	datasource: string;
	rows: number;
	columns: number;
	components: Array<WidgetComponentDocument>;
}

export interface WidgetDatasourceResponse<T> {
	[datasourceName: string]: T;
}

export interface WidgetDatasourceDataResponse
	extends WidgetDatasourceResponse<Array<DatasourceData>> {}

export interface WidgetDatasourceTypedDataResponse<T extends DatasourceData>
	extends WidgetDatasourceResponse<Array<T>> {}

export interface WidgetDatasourceQueryResponse
	extends WidgetDatasourceResponse<Query> {}

export function isWidgetDatasourceDataResponse<T extends DatasourceData>(
	value: any,
	dataVerificationFunc: (v: any) => v is T
): value is WidgetDatasourceTypedDataResponse<T> {
	return (
		value &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		Object.values(value).every(
			(val) => Array.isArray(val) && val.every((v) => dataVerificationFunc(v))
		)
	);
}

export interface DatasourceData {
	title: string;
}

export interface DatasourceDataString extends DatasourceData {
	value: string;
}

export interface DatasourceDataNumber extends DatasourceData {
	value: number;
}

export interface DatasourceDataMap extends DatasourceData {
	value: { [key: string]: any };
}

export function isDatasourceDataString(dp: any): dp is DatasourceDataString {
	return dp && dp.value && typeof dp.value === "string";
}

export function isDatasourceDataStringOrUndefined(
	dp: any
): dp is DatasourceDataString {
	return dp && (!dp.value || typeof dp.value === "string");
}

export function isDatasourceDataNumber(dp: any): dp is DatasourceDataNumber {
	return dp && dp.value && typeof dp.value === "number";
}

export function isDatasourceDataMap(dp: any): dp is DatasourceDataMap {
	return dp && typeof dp.value === "object" && !Array.isArray(dp.value);
}

export interface WidgetComponentDefinitionDocument {
	id: string;
	// This is a reference to the base component
	componentDefinitionReference: DocumentReference;
	position: GridItemPosition;
	type: string;
	props: { [key: string]: any };
}

export interface InsertField {
	type: InputType;
	required: boolean;
	datasource?: string;
	order?: number;
}

export interface Query {
	collection: string;
	where?: Array<WhereClause>;
	groupBy?: QueryGroupBy;
	target?: string;
}

export interface QueryGroupBy {
	field: string;
	granularity?: string;
	then?: QueryGroupBy;
}

export interface WhereClause {
	field: string;
	operator: ">" | ">=" | "==" | "<" | "<=";
	value: any;
}

export interface InsertQuery extends Query {
	insert: { [field: string]: InsertField };
}

export interface WidgetDatasourceDefinitionDocument {
	datasource?: DocumentReference;
	datasourceApp?: string;
	datasourceQuery: Query;
}

export interface WidgetComponentLayoutDefinitionDocument {
	id: string;
	name: string;
	rows: number;
	columns: number;
	datasources: { [datasourceName: string]: WidgetDatasourceDefinitionDocument };
	widgetComponentDefinitions: WidgetComponentDefinitionDocument[];
}

export interface WidgetDefinition {
	type: string;
	widgetComponentLayoutDefinitions: WidgetComponentLayoutDefinitionDocument[];
}
