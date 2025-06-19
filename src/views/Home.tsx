import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import WidgetGrid from "../components/widget/WidgetGrid";
import Widget, {
	getWidgetId,
	type WidgetPosition,
	type WidgetProps,
} from "../components/widget/Widget";
import { useEffect, useState } from "react";
import { useWidgetResizer } from "../hooks/useWidgetResizer";
import LogoutButton from "../components/auth/LogoutButton";

const db = getFirestore();

function getUserLayouts() {
	const user = auth.currentUser;
	if (!user) return Promise.reject(new Error("Not authenticated"));

	const layoutsRef = collection(db, "users", user.uid, "widget-layouts");
	return getDocs(layoutsRef).then((snapshot) =>
		snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
	);
}

interface HomeProps {
	isAuthenticated: boolean;
	isAuthLoading: boolean;
	firebaseUser: User | null;
	firebaseAuthError: Error | null;
}

const Home = (props: HomeProps) => {
	const [layouts, setLayouts] = useState<any[]>([]);
	const [loadingLayouts, setLoadingLayouts] = useState(true);
	const [layoutsError, setLayoutsError] = useState<Error | null>(null);

	const { selectedFiller, unsavedWidget, handleMouseUp } = useWidgetResizer();

	useEffect(() => {
		window.addEventListener("mouseup", (e: any) => handleMouseUp(e));
	}, []);

	useEffect(() => {
		if (props.isAuthenticated) {
			setLoadingLayouts(true);
			getUserLayouts()
				.then((data) => {
					setLayouts(data);
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
			<WidgetGrid columns={5} rows={5} selectedFiller={selectedFiller}>
				{layouts.length > 0 &&
					layouts[0].widgets.map((widget: WidgetProps) => (
						<Widget key={getWidgetId(widget)} {...widget}></Widget>
					))}
				{unsavedWidget && <Widget {...unsavedWidget}></Widget>}
			</WidgetGrid>
		</div>
	);
};

export default Home;
