import type { DocumentReference } from "firebase/firestore";
import type { GridItem, GridItemPosition } from "../grid/useGridItemPlacer";
import type { InputType } from "../../components/widget-components/InputForm";

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

export type ComponentName = "barchart" | "input";

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

export interface WidgetDatasourceQueryResponseData {
	[datasourceName: string]:
		| Array<{
				[key: string]: string | number | { [key: string]: any };
		  }>
		| Query;
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
}

export interface Query {
	collection: string;
	groupBy?: QueryGroupBy;
	target?: string;
}

export interface QueryGroupBy {
	field: string;
	granularity?: string;
	then?: QueryGroupBy;
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
