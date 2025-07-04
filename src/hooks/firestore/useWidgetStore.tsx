import {
	collection,
	getDocs,
	DocumentReference,
	getDoc,
	type DocumentData,
	Timestamp,
	setDoc,
	doc,
} from "firebase/firestore";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import Barchart from "../../components/widget-components/Barchart";
import type { LoadingState } from "../../components/widget-grid-infrastructure/Widget";
import InputForm from "../../components/widget-components/InputForm";
import {
	isInsertQuery,
	type ComponentName,
	type Query,
	type QueryGroupBy,
	type WidgetComponentDocument,
	type WidgetComponentLayoutDocument,
	type WidgetDatasourceQueryResponseData,
	type WidgetDocument,
} from "./types";

const monthOrder = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sept",
	"oct",
	"nov",
	"dec",
];

export const widgetComponentRegistry: Record<
	ComponentName,
	React.ComponentType<any>
> = {
	barchart: Barchart,
	input: InputForm,
};

export function useWidgetStore(
	widget: WidgetDocument,
	setLoading?: (loading: LoadingState) => void
	// setError?: (error: String | null) => void
) {
	const [widgetComponentLayout, setWidgetComponentLayout] =
		useState<WidgetComponentLayoutDocument>();
	const [widgetData, setWidgetData] =
		useState<WidgetDatasourceQueryResponseData>();

	useEffect(() => {
		loadWidgetComponentLayout();

		loadWidgetDataFromDatasources();
		const interval = setInterval(() => {
			loadWidgetDataFromDatasource("default").then((data) => {
				if (data) {
					setWidgetData((prev) => ({
						...prev,
						default: data,
					}));
				}
			});
		}, 30000); // TODO: this should change based on user activity / which view is being loaded.
		return () => clearInterval(interval);
	}, []);

	async function getWidgetComponentLayout(widgetRef: DocumentReference) {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		const widgetSnapshot = await getDoc(widgetRef);

		if (widgetSnapshot.exists()) {
			const componentLayoutRef: DocumentReference<WidgetComponentLayoutDocument> =
				widgetSnapshot.get("componentLayoutRef");

			const componentLayoutSnapshot = await getDoc(componentLayoutRef);

			if (componentLayoutSnapshot.exists()) {
				const layout = {
					id: componentLayoutSnapshot.id,
					...componentLayoutSnapshot.data(),
				} as WidgetComponentLayoutDocument;

				const componentCollectionRef = collection(
					componentLayoutRef,
					"components"
				);

				const componentsSnapshot = await getDocs(componentCollectionRef);

				const components: Array<WidgetComponentDocument> = [];
				if (!componentsSnapshot.empty) {
					componentsSnapshot.docs.map((component) =>
						components.push({
							id: component.id,
							...component.data(),
						} as WidgetComponentDocument)
					);
				}

				layout.components = components;

				return layout;
			} else {
				console.error(
					`No component layout found with ref: ${componentLayoutRef.path}`
				);
			}
		} else {
			console.error(`No widgets found with ref: ${widget.dbRef}`);
		}
	}

	function getKey(dataPoint: DocumentData, queryGroupBy: QueryGroupBy) {
		const rawKey = dataPoint[queryGroupBy.field];

		if (queryGroupBy.field === "timestamp" && rawKey instanceof Timestamp) {
			const date = rawKey.toDate();
			if (queryGroupBy.granularity === "month") {
				return date.toLocaleString("default", { month: "short" });
			}
		}

		return rawKey;
	}

	function sortDataByKeys(
		aggData: Record<string, number | any[] | Record<any, any>>,
		groupBy: QueryGroupBy
	) {
		if (groupBy.granularity === "month") {
			const sortedEntries = Object.entries(aggData).sort(
				([monthA], [monthB]) =>
					monthOrder.indexOf(monthA.toLowerCase()) -
					monthOrder.indexOf(monthB.toLocaleLowerCase())
			);

			return Object.fromEntries(sortedEntries);
		}

		// TODO: add a sortBy clause to the query

		return aggData;
	}

	function processData(rawData: DocumentData[], query: Query) {
		if (query.groupBy === undefined || query.target === undefined)
			return rawData;

		const queryGroupBy = query.groupBy;
		const queryTarget = query.target;

		const aggregatedData: Record<string, number | any[] | Record<any, any>> =
			rawData.reduce((agg, dataPoint) => {
				const key = getKey(dataPoint, queryGroupBy);

				if (queryGroupBy.then) {
					const collected =
						Array.isArray(agg[key]) && agg[key].length > 0
							? [...agg[key], dataPoint]
							: [dataPoint];

					agg[key] = collected;
				} else {
					// Only sum if number, TODO: replace with "agg func" defined in query
					const rawValue = dataPoint[queryTarget];
					const value = isNaN(+rawValue) ? rawValue : +rawValue;
					agg[key] = agg[key] ? agg[key] + value : value;
				}

				return agg;
			}, {});

		const sortedAggregatedData = sortDataByKeys(aggregatedData, query.groupBy);

		if (query.groupBy.then) {
			const innerGroupBy = query.groupBy.then;
			Object.entries(sortedAggregatedData).forEach(([key, value]) => {
				if (Array.isArray(value))
					sortedAggregatedData[key] = processData(value, {
						...query,
						groupBy: innerGroupBy,
					});
			});
		}

		return sortedAggregatedData;
	}

	async function queryWidgetDatasource(
		datasource: DocumentReference,
		datasourceQuery: Query
	) {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		if (!datasource || !datasourceQuery) return Promise.reject(); //remove later

		const datasourceCollectionRef = collection(
			datasource,
			datasourceQuery.collection
		);

		const dataSnapshot = await getDocs(datasourceCollectionRef);

		if (!dataSnapshot.empty) {
			const rawData = dataSnapshot.docs.map((d) => d.data());
			const aggregatedData = processData(rawData, datasourceQuery);

			const data = Object.entries(aggregatedData).map(([key, value]) => ({
				title: key,
				value: value,
			}));

			return data;
		}
	}

	function insertIntoWidgetDatasource(datasourceEntryData: {
		[field: string]: any;
	}) {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		const { datasource, datasourceQuery } = widget.datasources["default"];

		if (!datasource || !datasourceQuery) return Promise.reject(); //remove later

		const entryId = crypto.randomUUID();

		const entryRef = doc(datasource, datasourceQuery.collection, entryId);

		setDoc(entryRef, datasourceEntryData, { merge: true })
			.then(() => {})
			.catch((err) => {
				throw err;
			});
	}

	async function loadWidgetDataFromDatasource(datasourceName: string) {
		if (!widget.datasources || !(datasourceName in widget.datasources)) return;

		const { datasource, datasourceQuery } = widget.datasources[datasourceName];

		if (datasource && datasourceQuery) {
			if (datasourceQuery.groupBy && datasourceQuery.target) {
				return await queryWidgetDatasource(datasource, datasourceQuery);
			} else if (isInsertQuery(datasourceQuery)) {
				return datasourceQuery;
			} else {
				console.warn(
					`Widget ${widget.id} has an invalid datasource: ${datasourceName}`
				);
			}
		} else {
			console.warn(
				`No datasource defined for widget ${widget.id} with name: ${datasourceName}`
			);
		}
	}

	function loadWidgetDataFromDatasources() {
		if (!widget.datasources) return;
		for (const datasourceName of Object.keys(widget.datasources)) {
			loadWidgetDataFromDatasource(datasourceName).then((data) => {
				if (data)
					setWidgetData((prev) => ({
						...prev,
						[datasourceName]: data,
					}));
				else
					console.warn(
						`Widget ${widget.id} has an invalid datasource: ${datasourceName}`
					);
			});
		}
	}

	function loadWidgetComponentLayout(updateLoadingState: boolean = true) {
		if (!widget.dbRef) return;
		if (updateLoadingState)
			setLoading?.({
				isLoading: true,
				message: "Loading widget component layout",
			});
		getWidgetComponentLayout(widget.dbRef)
			.then((wcl) => (wcl ? setWidgetComponentLayout(wcl) : null))
			.finally(() => {
				if (updateLoadingState) setLoading?.({ isLoading: false });
			});
	}

	return { widgetComponentLayout, widgetData, insertIntoWidgetDatasource };
}
