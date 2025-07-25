import {
	collection,
	getDocs,
	DocumentReference,
	getDoc,
	type DocumentData,
	Timestamp,
	setDoc,
	doc,
	query,
	where,
	CollectionReference,
	QueryFieldFilterConstraint,
} from "firebase/firestore";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import Barchart from "../../components/widget-components/Barchart";
import type { LoadingState } from "../../components/widget-grid-infrastructure/Widget";
import {
	isInsertQuery,
	isSearchQuery,
	type ComponentName,
	type Query,
	type QueryGroupBy,
	type SearchParameters,
	type SearchQuery,
	type WhereClause,
	type WidgetComponentDocument,
	type WidgetComponentLayoutDocument,
	type WidgetDatasourceResponse,
	type WidgetDocument,
} from "./types";
import Input from "../../components/widget-components/Input";
import Browser from "../../components/widget-components/Browser";

const monthOrder = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
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
	input: Input,
	browser: Browser,
};

export function useWidgetStore(
	widget: WidgetDocument,
	setLoading: (loading: LoadingState) => void,
	setError?: (error: String | null) => void
) {
	const [widgetComponentLayout, setWidgetComponentLayout] =
		useState<WidgetComponentLayoutDocument>();
	const [widgetData, setWidgetData] =
		useState<WidgetDatasourceResponse<unknown>>();

	useEffect(() => {
		loadWidgetComponentLayout();

		loadWidgetDataFromDatasources();
		const interval = setInterval(() => {
			getWidgetDataFromDatasource("default").then((data) => {
				if (data) {
					setWidgetData((prev) => ({
						...prev,
						default: data,
					}));
				}
			});
		}, 5000); // TODO: this should change based on user activity / which view is being loaded.
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
				throw new Error(
					`No component layout found with ref: ${componentLayoutRef.path}`
				);
			}
		} else {
			throw new Error(`No widgets found with ref: ${widget.dbRef?.path}`);
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

	function processData(rawData: DocumentData[], query: SearchQuery) {
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

	function addWhereClause(
		whereClause: WhereClause,
		whereClauses: Array<QueryFieldFilterConstraint>
	) {
		if (whereClause.value == "currentMonth") {
			const now = new Date();
			const currentDay = now.getDate();
			const currentMonth = now.getMonth();
			const currentYear = now.getFullYear();

			// TODO: configurable start date
			const periodStart = 14;

			if (currentDay < periodStart) {
				whereClauses.push(
					where(
						"timestamp",
						">=",
						new Date(currentYear, currentMonth - 1, periodStart)
					)
				);
				whereClauses.push(
					where(
						"timestamp",
						"<",
						new Date(currentYear, currentMonth, periodStart)
					)
				);
			} else {
				whereClauses.push(
					where(
						"timestamp",
						">=",
						new Date(currentYear, currentMonth, periodStart)
					)
				);
				whereClauses.push(
					where(
						"timestamp",
						"<",
						new Date(currentYear, currentMonth + 1, periodStart)
					)
				);
			}
		} else
			whereClauses.push(
				where(whereClause.field, whereClause.operator, whereClause.value)
			);
	}

	function buildQuery(
		collectionRef: CollectionReference,
		datasourceQuery: SearchQuery,
		indexed: boolean = true
	) {
		if (!datasourceQuery.where) return { ref: collectionRef };

		const whereClauses: Array<QueryFieldFilterConstraint> = [];
		const unusedWhereClauses: Array<WhereClause> = [];

		if (indexed) {
			for (const wc of datasourceQuery.where) {
				addWhereClause(wc, whereClauses);
			}
		} else if (datasourceQuery.where.length > 0) {
			addWhereClause(datasourceQuery.where[0], whereClauses);
			unusedWhereClauses.push(...datasourceQuery.where.slice(1));
		}

		return { ref: query(collectionRef, ...whereClauses), unusedWhereClauses };
	}

	async function queryWidgetDatasource(
		datasource: DocumentReference,
		datasourceQuery: Query,
		setError?: (err: React.ReactNode[]) => void
	) {
		const user = auth.currentUser;
		if (!user) throw new Error("Not authenticated");

		const datasourceCollectionRef = collection(
			datasource,
			datasourceQuery.collection
		);

		console.log("search query 1", datasourceQuery);

		try {
			const { ref } = buildQuery(datasourceCollectionRef, datasourceQuery);
			const dataSnapshot = await getDocs(ref);

			if (!dataSnapshot.empty) {
				const rawData = dataSnapshot.docs.map((d) => d.data());
				const aggregatedData = processData(rawData, datasourceQuery);

				const data = Object.entries(aggregatedData).map(([key, value]) => ({
					title: key,
					value: value,
				}));

				if (setError) setError([]);
				return data;
			}
			if (setError) setError([]);
		} catch (error: any) {
			if (
				error.code === "failed-precondition" &&
				error.message.includes("create it here")
			) {
				console.warn(
					"Missing composite index, using less efficient fallback. Error:",
					error.message,
					setError
				);

				if (setError) {
					const match = error.message.match(/https?:\/\/[^\s]+/);
					const indexUrl = match ? match[0] : null;
					setError([
						<span>
							Missing composite index, using less efficient fallback, consider
							setting an index{" "}
							<a href={indexUrl} target="_blank">
								here
							</a>
						</span>,
					]);
				}

				const { ref, unusedWhereClauses } = buildQuery(
					datasourceCollectionRef,
					datasourceQuery,
					false
				);

				console.log("fallback", ref, unusedWhereClauses);

				const dataSnapshot = await getDocs(ref);

				if (!dataSnapshot.empty) {
					const rawData = dataSnapshot.docs.map((d) => d.data());
					const filteredData = unusedWhereClauses
						? filterData(rawData, unusedWhereClauses)
						: rawData;
					const aggregatedData = processData(filteredData, datasourceQuery);

					const data = Object.entries(aggregatedData).map(([key, value]) => ({
						title: key,
						value: value,
					}));

					return data;
				}
			} else {
				throw error;
			}
		}

		return [];
	}

	function filterData(
		data: DocumentData[],
		clauses: WhereClause[]
	): DocumentData[] {
		return data.filter((item) =>
			clauses.every(({ field, operator, value }) => {
				const fieldValue = item[field];

				switch (operator) {
					case ">":
						return fieldValue > value;
					case ">=":
						return fieldValue >= value;
					case "==":
						return fieldValue == value;
					case "<":
						return fieldValue < value;
					case "<=":
						return fieldValue <= value;
					default:
						return false;
				}
			})
		);
	}

	function insertIntoWidgetDatasource(
		datasourceEntryData: {
			[field: string]: any;
		},
		datasourceName?: string
	) {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		const { datasource, datasourceQuery } =
			widget.datasources[datasourceName ? datasourceName : "default"];

		if (!datasource || !datasourceQuery) return Promise.reject(); //remove later

		const entryId = crypto.randomUUID();

		const entryRef = doc(datasource, datasourceQuery.collection, entryId);

		setDoc(entryRef, datasourceEntryData, { merge: true })
			.then(() => {})
			.catch((err) => {
				throw err;
			});
	}

	async function getWidgetDataFromDatasource(
		datasourceName: string,
		datasourceSearchQueryOverride?: SearchParameters,
		setError?: (err: React.ReactNode[]) => void
	) {
		if (!widget.datasources || !(datasourceName in widget.datasources)) return;

		const { datasource, datasourceQuery } = widget.datasources[datasourceName];

		try {
			if (datasource && datasourceQuery) {
				console.log(datasourceQuery);
				if (isInsertQuery(datasourceQuery)) {
					return datasourceQuery;
				} else if (datasourceQuery.collection) {
					const q = isSearchQuery(datasourceSearchQueryOverride)
						? {
								...datasourceQuery,
								...datasourceSearchQueryOverride,
						  }
						: datasourceQuery;
					return await queryWidgetDatasource(datasource, q, setError);
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
		} catch (e: any) {
			setError?.(e.message);
		}
	}

	function loadWidgetDataFromDatasource(
		datasourceName: string,
		datasourceSearchQuery?: SearchParameters,
		setError?: (err: React.ReactNode[]) => void
	) {
		getWidgetDataFromDatasource(
			datasourceName,
			datasourceSearchQuery,
			setError
		).then((data) => {
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

	function loadWidgetDataFromDatasources() {
		console.log(widget.datasources);
		if (!widget.datasources) return;
		for (const datasourceName of Object.keys(widget.datasources)) {
			loadWidgetDataFromDatasource(datasourceName);
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
			.catch((e) => setError?.(e.message))
			.finally(() => {
				if (updateLoadingState) setLoading?.({ isLoading: false });
			});
	}

	return {
		widgetComponentLayout,
		widgetData,
		insertIntoWidgetDatasource,
		loadWidgetDataFromDatasource,
	};
}
