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
} from "firebase/firestore";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import type {
	WidgetCreationData,
	WidgetDatasourceDocument,
	WidgetDocument,
	WidgetLayoutDocument,
} from "./types";
import type { LoadingState } from "../../components/widget-grid-infrastructure/Widget";
import { onAuthStateChanged, type User } from "firebase/auth";

export function useWidgetGridStore(
	setLoading: (loading: LoadingState) => void,
	setError: (error: String | null) => void
) {
	const db = getFirestore();

	const [activeLayout, setActiveLayout] = useState<WidgetLayoutDocument | null>(
		null
	);

	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		console.log("USER", user);
		if (user) loadActiveLayout();
	}, [user?.uid]);

	async function getWidgets(layoutId: string) {
		const user = auth.currentUser;
		if (!user) return Promise.reject(new Error("Not authenticated 1"));

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
					} as WidgetDocument)
			);
		} else {
			console.warn("No widgets found in layout.");
			return [];
		}
	}

	function loadActiveLayout(silent?: boolean) {
		if (!user) {
			setError("Not Authenticated 2");
			return;
		}

		if (!silent) setLoading({ isLoading: true, message: "Loading layout" });

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
					} as WidgetLayoutDocument);
				});
			})
			.catch((err) => {
				setError(err.message || String(err));
			})
			.finally(() => {
				if (!silent) setLoading({ isLoading: false });
			});
	}

	function saveWidget(layoutId: string, widget: WidgetCreationData) {
		if (!user) {
			setError("Not authenticated 3");
			return;
		}

		const widgetRef = doc(
			collection(db, "users", user.uid, "widget-layouts", layoutId, "widgets")
		);

		const { id, ...data } = widget;

		const defaultDatasource = widget.datasources["default"];

		const widgetData: WidgetDocument = {
			componentLayoutRef: doc(
				db,
				"widgets",
				data.type,
				"component-layouts",
				id
			),
			type: data.type,
			datasources: Object.entries(widget.datasources).reduce<{
				[key: string]: WidgetDatasourceDocument;
			}>((agg, [datasourceName, datasourceData]) => {
				const datasource = datasourceData.datasource
					? datasourceData.datasource
					: defaultDatasource.datasourceApp
					? doc(db, "users", user.uid, "apps", defaultDatasource.datasourceApp)
					: null;

				if (!datasource) return agg;

				agg[datasourceName] = {
					datasource: datasource,
					datasourceQuery: datasourceData.datasourceQuery,
				};

				return agg;
			}, {}),
			position: data.position,
		};

		setDoc(widgetRef, widgetData, { merge: true })
			.then(() => loadActiveLayout(true))
			.catch((err) => {
				setError(err.message || String(err));
				throw err;
			});
	}

	function deleteWidget(layoutId: string, widgetId: string) {
		if (!user) {
			setError("Not authenticated 4");
			return;
		}

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

	function saveLayout(layout: WidgetLayoutDocument) {
		if (!user) {
			setError("Not authenticated 5");
			return;
		}

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
