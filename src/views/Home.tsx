import Grid from "../components/widget-grid-infrastructure/Grid";
import Widget, {
	getWidgetId,
} from "../components/widget-grid-infrastructure/Widget";
import { useState } from "react";
import { useWidgetGridStore } from "../hooks/firestore/useWidgetGridStore";
import { useFirebaseAuth } from "../hooks/auth/useFirebaseAuth";
import type {
	WidgetCreationData,
	WidgetDocument,
} from "../hooks/firestore/types";

const Home = () => {
	const [loadingLayouts, setLoadingLayouts] = useState(true);
	const [layoutsError, setLayoutsError] = useState<String | null>(null);

	const {
		// user: firebaseUser,
		loading: isFirebaseAuthLoading,
		// error: firebaseAuthError,
	} = useFirebaseAuth();

	const { activeLayout, saveWidget, deleteWidget } = useWidgetGridStore(
		setLoadingLayouts,
		setLayoutsError
	);

	if (isFirebaseAuthLoading || loadingLayouts) {
		return <div>Loading...</div>;
	}

	if (layoutsError) {
		return <div>Error loading layouts: {layoutsError}</div>;
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
