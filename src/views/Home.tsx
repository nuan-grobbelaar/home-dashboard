import { useState } from "react";
import { useWidgetGridStore } from "../hooks/firestore/useWidgetGridStore";
import { useFirebaseAuth } from "../hooks/auth/useFirebaseAuth";
import type {
	WidgetCreationData,
	WidgetDocument,
} from "../hooks/firestore/types";
import Grid from "../components/widget-grid-infrastructure/Grid";
import Widget, {
	getWidgetId,
} from "../components/widget-grid-infrastructure/Widget";
import LoadingBar from "../components/widget-grid-infrastructure/LoadingBar";

const Home = () => {
	const [loadingLayouts, setLoadingLayouts] = useState(true);
	const [error, setError] = useState<String | null>(null);

	const {
		// user: firebaseUser,
		loading: isFirebaseAuthLoading,
	} = useFirebaseAuth(setError);

	const { activeLayout, saveWidget, deleteWidget } = useWidgetGridStore(
		setLoadingLayouts,
		setError
	);

	if (error) {
		return <div className="page-status">{error}</div>;
	}

	if (isFirebaseAuthLoading || loadingLayouts) {
		return (
			<div className="page-status">
				<LoadingBar message="Loading Layout" />
			</div>
		);
	}

	return (
		<div className="dashboard">
			{/* <LogoutButton /> */}
			{activeLayout && (
				<Grid
					ItemComponent={Widget}
					columns={activeLayout.columns}
					rows={activeLayout.rows}
					onSaveGridItem={(item: WidgetCreationData) => {
						saveWidget(activeLayout.id, item);
					}}
				>
					{activeLayout.widgets.map((widget: WidgetDocument) => (
						<Widget
							key={getWidgetId(widget)}
							{...widget}
							removeItem={(id?: string) =>
								id ? deleteWidget(activeLayout.id, id) : null
							}
							editMode={true}
							dbRef={widget.dbRef}
						>
							{widget.type}
						</Widget>
					))}
				</Grid>
			)}
		</div>
	);
};

export default Home;
