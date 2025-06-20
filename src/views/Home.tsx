import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";
import {
	getFirestore,
	collection,
	getDocs,
	query,
	where,
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
	id: any;
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
			(doc) => doc.data() as Omit<WidgetProps, "unsaved">
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
	// const activeLayout: Layout = getDocs(activeLayoutRef).then((snapshot) =>
	// 	snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
	// );
}

// function saveWidgetLayout() {
// 	console.log("saving", layout);
// }

const Home = (props: HomeProps) => {
	const [layout, setLayout] = useState<Layout | null>(null);
	const [loadingLayouts, setLoadingLayouts] = useState(true);
	const [layoutsError, setLayoutsError] = useState<Error | null>(null);

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
			>
				{layout &&
					layout.widgets.map((widget: WidgetProps) => (
						<Widget key={getWidgetId(widget)} {...widget}></Widget>
					))}
			</WidgetGrid>
		</div>
	);
};

export default Home;
