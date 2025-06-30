import {
	collection,
	getDocs,
	DocumentReference,
	getDoc,
	type DocumentData,
	Timestamp,
} from "firebase/firestore";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import Barchart from "../components/graphs/Barchart";
import type { WidgetData } from "./useWidgetGridStore";
import type { WidgetLoading } from "../components/widget/Widget";
import type { Query, QueryGroupBy } from "./useWidgetDefinitionStore";

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

export type ComponentName = "barchart";

export const widgetComponentRegistry: Record<
	ComponentName,
	React.ComponentType<any>
> = {
	barchart: Barchart,
};

export interface WidgetComponent {
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

export interface WidgetComponentLayout {
	datasource: string;
	rows: number;
	columns: number;
	components: Array<WidgetComponent>;
}

export function useWidgetStore(
	widget: WidgetData,
	setLoading?: (loading: WidgetLoading) => void
	// setError?: (error: String | null) => void
) {
	const [widgetComponentLayout, setWidgetComponentLayout] =
		useState<WidgetComponentLayout>();
	const [widgetData, setWidgetData] = useState<
		Array<{
			[key: string]: string | number | { [key: string]: any };
		}>
	>();

	useEffect(() => {
		// setLoading?.({
		// 	isLoading: true,
		// 	message: "Loading widget component layout",
		// });
		loadWidgetComponentLayout();
		queryWidgetDatasource();

		const interval = setInterval(() => {
			queryWidgetDatasource();
		}, 10000);

		return () => clearInterval(interval);
	}, [widget]);

	async function getWidgetComponentLayout(widgetRef: DocumentReference) {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		const widgetSnapshot = await getDoc(widgetRef);

		if (widgetSnapshot.exists()) {
			console.log("useWidgetStore", widgetSnapshot.data());
			const componentLayoutRef: DocumentReference<WidgetComponentLayout> =
				widgetSnapshot.get("componentLayoutRef");

			const componentLayoutSnapshot = await getDoc(componentLayoutRef);

			if (componentLayoutSnapshot.exists()) {
				const layout = {
					id: componentLayoutSnapshot.id,
					...componentLayoutSnapshot.data(),
				} as WidgetComponentLayout;

				const componentCollectionRef = collection(
					componentLayoutRef,
					"components"
				);

				const componentsSnapshot = await getDocs(componentCollectionRef);

				const components: Array<WidgetComponent> = [];
				if (!componentsSnapshot.empty) {
					componentsSnapshot.docs.map((component) =>
						components.push({
							id: component.id,
							...component.data(),
						} as WidgetComponent)
					);
				}

				layout.components = components;
				console.log("useWidgetStore", "components", components);

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

	function getKey(dataPoint: DocumentData, query: Query) {
		const rawKey = dataPoint[query.groupBy.field];

		if (query.groupBy.field === "timestamp" && rawKey instanceof Timestamp) {
			const date = rawKey.toDate();
			if (query.groupBy.granularity === "month") {
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
		const aggregatedData: Record<string, number | any[] | Record<any, any>> =
			rawData.reduce((agg, dataPoint) => {
				const key = getKey(dataPoint, query);

				if (query.groupBy.then) {
					const collected =
						Array.isArray(agg[key]) && agg[key].length > 0
							? [...agg[key], dataPoint]
							: [dataPoint];

					agg[key] = collected;
					console.log("DATA", "agg", dataPoint);
				} else {
					const value = +dataPoint[query.target]!;
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

	function queryWidgetDatasource() {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		const { datasource, datasourceQuery } = widget;

		if (!datasource || !datasourceQuery) return Promise.reject(); //remove later

		const datasourceCollectionRef = collection(
			datasource,
			datasourceQuery.collection
		);

		getDocs(datasourceCollectionRef).then((dataSnapshot) => {
			if (!dataSnapshot.empty) {
				const rawData = dataSnapshot.docs.map((d) => d.data());
				console.log("DATA", "raw", rawData);
				const aggregatedData = processData(rawData, datasourceQuery);
				console.log("DATA", "agg", aggregatedData);

				const data = Object.entries(aggregatedData).map(([key, value]) => ({
					title: key,
					value: value,
				}));

				console.log("useWidgetStore", "data", data);
				setWidgetData(data);
			}
		});
	}

	function loadWidgetComponentLayout() {
		if (!widget.dbRef) return;
		setLoading?.({
			isLoading: true,
			message: "Loading widget component layout",
		});
		getWidgetComponentLayout(widget.dbRef)
			.then((wcl) => (wcl ? setWidgetComponentLayout(wcl) : null))
			.finally(() => setLoading?.({ isLoading: false }));
	}

	return { widgetComponentLayout, widgetData };
}
