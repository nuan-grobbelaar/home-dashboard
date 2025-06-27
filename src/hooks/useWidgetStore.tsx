import {
	collection,
	getDocs,
	DocumentReference,
	getDoc,
} from "firebase/firestore";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import Barchart from "../components/graphs/Barchart";
import type { WidgetData } from "./useWidgetGridStore";
import type { WidgetLoading } from "../components/widget/Widget";

export type ComponentName = "barchart" | "linegraph";

export const widgetComponentRegistry: Record<
	ComponentName,
	React.ComponentType<any>
> = {
	barchart: Barchart,
	linegraph: Barchart,
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
			[key: string]: string | number;
		}>
	>();

	useEffect(() => {
		setLoading?.({ isLoading: false });
		loadWidgetComponentLayout();
		queryWidgetDatasource();

		const interval = setInterval(() => {
			queryWidgetDatasource();
		}, 10000);

		return () => clearInterval(interval);
	}, [widget]);

	function loadWidgetComponentLayout() {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));
		if (!widget.dbRef) return Promise.reject();

		getDoc(widget.dbRef).then((widgetSnapshot) => {
			if (widgetSnapshot.exists()) {
				console.log("useWidgetStore", widgetSnapshot.data());
				const componentLayoutRef: DocumentReference<WidgetComponentLayout> =
					widgetSnapshot.get("componentLayoutRef");

				getDoc(componentLayoutRef).then((componentLayoutSnapshot) => {
					if (componentLayoutSnapshot.exists()) {
						const layout = {
							id: componentLayoutSnapshot.id,
							...componentLayoutSnapshot.data(),
						} as WidgetComponentLayout;

						const componentCollectionRef = collection(
							componentLayoutRef,
							"components"
						);

						getDocs(componentCollectionRef).then((componentsSnapshot) => {
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
							setWidgetComponentLayout(layout);
						});
					} else {
						console.error(
							`No component layout found with ref: ${componentLayoutRef.path}`
						);
					}
				});
			} else {
				console.error(`No widgets found with ref: ${widget.dbRef}`);
			}
		});
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
				const aggregatedData: Record<string, number> = rawData.reduce(
					(agg, dataPoint) => {
						const key = dataPoint[datasourceQuery.groupBy];
						const value = +dataPoint[datasourceQuery.target]!;
						agg[key] = agg[key] ? agg[key] + value : value;
						return agg;
					},
					{}
				);

				// const data = Object.entries(aggregatedData).map(([key, value]) => ({
				// 	[datasourceQuery.groupBy]: key,
				// 	[datasourceQuery.target]: value,
				// }));

				const data = Object.entries(aggregatedData).map(([key, value]) => ({
					title: key,
					value: value,
				}));

				console.log("useWidgetStore", "data", data);
				setWidgetData(data);
			}
		});
	}

	return { widgetComponentLayout, widgetData };
}
