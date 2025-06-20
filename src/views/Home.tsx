import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";
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
import WidgetGrid from "../components/widget/WidgetGrid";
import Widget, {
	getWidgetId,
	type WidgetData,
	type WidgetProps,
} from "../components/widget/Widget";
import { useEffect, useState } from "react";

const db = getFirestore();

interface Layout {
	id?: any;
	rows: number;
	columns: number;
	widgets: Array<WidgetData>;
}

interface HomeProps {
	isAuthenticated: boolean;
	isAuthLoading: boolean;
	firebaseUser: User | null;
	firebaseAuthError: Error | null;
}

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

async function getActiveLayout() {
	const user = auth.currentUser;
	if (!user) return Promise.reject(new Error("Not authenticated"));

	const activeLayoutRef = collection(db, "users", user.uid, "widget-layouts");

	const q = query(activeLayoutRef, where("active", "==", true));
	const querySnapshot = await getDocs(q);
	if (!querySnapshot.empty) {
		const doc = querySnapshot.docs[0];
		const layoutId = doc.id;
		const widgets = await getLayoutWidgets(layoutId);
		console.log("loading", {
			id: doc.id,
			widgets: widgets,
			...doc.data(),
		} as Layout);
		return { id: doc.id, widgets: widgets, ...doc.data() } as Layout;
	} else {
		console.log("No active layout found.");
		return null;
	}
}

async function saveLayout(layout: Layout) {
	const user = auth.currentUser;
	if (!user) throw new Error("Not authenticated");

	const layoutId = layout.id || crypto.randomUUID();

	const layoutRef = doc(db, "users", user.uid, "widget-layouts", layoutId);
	const widgetsRef = collection(layoutRef, "widgets");

	const { widgets, id, ...layoutData } = layout;

	await setDoc(layoutRef, layoutData, { merge: true });

	const batch = writeBatch(db);

	widgets.forEach((widget) => {
		const widgetId = widget.id || crypto.randomUUID();
		const widgetRef = doc(widgetsRef, widgetId);
		const { id, ...widgetData } = widget;
		batch.set(widgetRef, widgetData);
	});

	await batch.commit();
}

const Home = (props: HomeProps) => {
	const [layout, setLayout] = useState<Layout | null>(null);
	const [loadingLayouts, setLoadingLayouts] = useState(true);
	const [layoutsError, setLayoutsError] = useState<Error | null>(null);

	function saveWidget(widget: WidgetData, layout: Layout) {
		layout.widgets = [...layout.widgets, widget];
		saveWidgetLayout(layout);
	}

	function saveWidgetLayout(layout: Layout) {
		saveLayout(layout).then(() =>
			getActiveLayout()
				.then((data) => {
					setLayout(data);
					setLoadingLayouts(false);
				})
				.catch((error) => {
					setLayoutsError(error);
					setLoadingLayouts(false);
				})
		);
	}

	useEffect(() => {
		if (props.isAuthenticated) {
			setLoadingLayouts(true);
			getActiveLayout()
				.then((data) => {
					setLayout(data);
					setLoadingLayouts(false);
				})
				.catch((error) => {
					setLayoutsError(error);
					setLoadingLayouts(false);
				});
		}
	}, [props.isAuthenticated]);

	if (props.isAuthLoading || loadingLayouts) {
		return <div>Loading...</div>;
	}

	if (!props.isAuthenticated) {
		return <Navigate to="/login" />;
	}

	if (layoutsError) {
		return <div>Error loading layouts: {layoutsError.message}</div>;
	}

	return (
		<div className="dashboard">
			{/* <LogoutButton /> */}
			<WidgetGrid
				columns={layout ? layout.columns : 5}
				rows={layout ? layout.rows : 5}
				onWidgetTypeSelect={(widget: WidgetData) =>
					saveWidget(
						widget,
						layout ? layout : { rows: 5, columns: 5, widgets: [] }
					)
				}
			>
				{layout &&
					layout.widgets.map((widget: WidgetProps) => (
						<Widget key={getWidgetId(widget)} {...widget} editMode>
							{widget.type}
						</Widget>
					))}
			</WidgetGrid>
		</div>
	);
};

export default Home;
