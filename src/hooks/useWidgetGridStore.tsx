import {
	getFirestore,
	collection,
	getDocs,
	query,
	where,
	setDoc,
	writeBatch,
	doc,
} from "firebase/firestore";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import type { Layout } from "../views/Home";
import type { WidgetData } from "../components/widget/Widget";

export function useWidgetGridStore(
	setLoading: (isLoading: boolean) => void,
	setError: (error: String | null) => void
) {
	const db = getFirestore();

	// const [layouts, setLayouts] = useState<Layout[]>([]);
	const [activeLayout, setActiveLayout] = useState<Layout | null>(null);

	useEffect(() => {
		loadActiveLayout();
	}, []);

	async function getLayoutWidgets(layoutId: any) {
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
				(doc) => ({ id: doc.id, ...doc.data() } as WidgetData)
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

				getLayoutWidgets(layoutId).then((widgets) => {
					setActiveLayout({
						id: doc.id,
						widgets,
						...doc.data(),
					} as Layout);
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

	function saveWidget(layoutId: string, widget: WidgetData) {
		const user = auth.currentUser;
		if (!user) throw new Error("Not authenticated");

		const widgetId = widget.id || crypto.randomUUID();

		const widgetRef = doc(
			db,
			"users",
			user.uid,
			"widget-layouts",
			layoutId,
			"widgets",
			widgetId
		);

		const { id, ...widgetData } = widget;

		setDoc(widgetRef, widgetData, { merge: true })
			.then(() => loadActiveLayout(true))
			.catch((err) => {
				setError(err.message || String(err));
				throw err;
			});
	}

	function saveLayout(layout: Layout) {
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

	return { activeLayout, saveWidget, saveLayout };
}
