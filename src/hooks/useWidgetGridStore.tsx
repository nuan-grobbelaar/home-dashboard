import {
	getFirestore,
	collection,
	getDocs,
	query,
	where,
	setDoc,
	writeBatch,
	doc,
	deleteDoc,
	DocumentReference,
} from "firebase/firestore";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import type { GridItem, GridItemPosition } from "./useGridItemPlacer";
import type { WidgetComponentLayoutDefinition } from "./useWidgetDefinitionStore";

// The layout of widgets inside the widget grid
export interface WidgetLayoutData {
	id?: any;
	rows: number;
	columns: number;
	widgets: Array<WidgetData>;
}

export interface WidgetData {
	id?: any;
	dbRef?: DocumentReference;
	type?: string;
	componentLayoutRef?: DocumentReference;
	position: GridItemPosition;
	datasource?: DocumentReference;
	datasourceQuery?: {
		collection: string;
		groupBy: string;
		target: string;
	};
}

export type WidgetCreationData = WidgetComponentLayoutDefinition &
	GridItem & {
		type: string;
	};

export function useWidgetGridStore(
	setLoading: (isLoading: boolean) => void,
	setError: (error: String | null) => void
) {
	const db = getFirestore();

	// const [layouts, setLayouts] = useState<Layout[]>([]);
	const [activeLayout, setActiveLayout] = useState<WidgetLayoutData | null>(
		null
	);

	useEffect(() => {
		loadActiveLayout();
		console.log("useWidgetGridStore", "layout", activeLayout);
	}, []);

	async function getWidgets(layoutId: string) {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated"));

		const layoutWidgetsRef = collection(
			db,
			"users",
			user.uid,
			"widget-layouts",
			layoutId,
			"widgets"
		);

		const querySnapshot = await getDocs(layoutWidgetsRef);

		if (!querySnapshot.empty) {
			return querySnapshot.docs.map(
				(d) =>
					({
						id: d.id,
						dbRef: doc(
							db,
							"users",
							user.uid,
							"widget-layouts",
							layoutId,
							"widgets",
							d.id
						),
						...d.data(),
					} as WidgetData)
			);
		} else {
			console.log("No widgets found in layout.");
			return [];
		}
	}

	function loadActiveLayout(silent?: boolean) {
		const user = auth.currentUser;
		if (!user) {
			setError("Not Authenticated");
			throw new Error("Not Authenticated");
		}

		if (!silent) setLoading(true);

		const activeLayoutRef = collection(db, "users", user.uid, "widget-layouts");
		const q = query(activeLayoutRef, where("active", "==", true));

		getDocs(q)
			.then((querySnapshot) => {
				if (querySnapshot.empty) {
					throw new Error("No active widget grid layout found");
				}

				const doc = querySnapshot.docs[0];
				const layoutId = doc.id;

				getWidgets(layoutId).then((widgets) => {
					setActiveLayout({
						id: doc.id,
						widgets,
						...doc.data(),
					} as WidgetLayoutData);
				});
			})
			.catch((err) => {
				setError(err.message || String(err));
				throw err;
			})
			.finally(() => {
				if (!silent) setLoading(false);
			});
	}

	function saveWidget(layoutId: string, widget: WidgetCreationData) {
		const user = auth.currentUser;
		if (!user) throw new Error("Not authenticated");

		const widgetRef = doc(
			collection(db, "users", user.uid, "widget-layouts", layoutId, "widgets")
		);

		const { id, ...data } = widget;

		const widgetData: WidgetData = {
			componentLayoutRef: doc(
				db,
				"widgets",
				data.type,
				"component-layouts",
				id
			),
			type: data.type,
			datasource: doc(db, "users", user.uid, "apps", data.datasourceApp),
			datasourceQuery: data.datasourceQuery,
			position: data.position,
		};

		console.log("saving", id);

		setDoc(widgetRef, widgetData, { merge: true })
			.then(() => loadActiveLayout(true))
			.catch((err) => {
				setError(err.message || String(err));
				throw err;
			});
	}

	function deleteWidget(layoutId: string, widgetId: string) {
		const user = auth.currentUser;
		if (!user) throw new Error("Not authenticated");

		const widgetRef = doc(
			db,
			"users",
			user.uid,
			"widget-layouts",
			layoutId,
			"widgets",
			widgetId
		);

		deleteDoc(widgetRef)
			.then(() => loadActiveLayout(true))
			.catch((err) => {
				setError(err.message || String(err));
				throw err;
			});
	}

	function saveLayout(layout: WidgetLayoutData) {
		const user = auth.currentUser;
		if (!user) throw new Error("Not authenticated");

		const layoutId = layout.id || crypto.randomUUID();

		const layoutRef = doc(db, "users", user.uid, "widget-layouts", layoutId);
		const widgetsRef = collection(layoutRef, "widgets");

		const { widgets, id, ...layoutData } = layout;

		setDoc(layoutRef, layoutData, { merge: true })
			.then(() => {
				const batch = writeBatch(db);

				widgets.forEach((widget) => {
					const widgetId = widget.id || crypto.randomUUID();
					const widgetRef = doc(widgetsRef, widgetId);
					const { id, ...widgetData } = widget;
					batch.set(widgetRef, widgetData);
				});

				batch.commit().catch((err) => {
					setError(err.message || String(err));
					throw err;
				});
			})
			.then(() => loadActiveLayout(true))
			.catch((err) => {
				setError(err.message || String(err));
				throw err;
			});
	}

	return {
		activeLayout,
		saveWidget,
		deleteWidget,
		saveLayout,
	};
}
