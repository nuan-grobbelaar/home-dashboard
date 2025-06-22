import Grid from "../components/widget/Grid";
import Widget, {
	getWidgetId,
	type WidgetData,
	type WidgetProps,
} from "../components/widget/Widget";
import { useState } from "react";
import { useWidgetGridStore } from "../hooks/useWidgetGridStore";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

export interface Layout {
	id?: any;
	rows: number;
	columns: number;
	widgets: Array<WidgetData>;
}

const Home = () => {
	const [loadingLayouts, setLoadingLayouts] = useState(true);
	const [layoutsError, setLayoutsError] = useState<String | null>(null);

	const {
		user: firebaseUser,
		loading: isFirebaseAuthLoading,
		error: firebaseAuthError,
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
					onSaveGridItem={(item: WidgetProps) => {
						saveWidget(activeLayout.id, {
							id: item.id,
							position: item.position,
							type: item.type,
						});
					}}
				>
					{activeLayout.widgets.map((widget: WidgetProps) => (
						<Widget
							key={getWidgetId(widget)}
							{...widget}
							removeItem={(id?: string) =>
								id ? deleteWidget(activeLayout.id, id) : null
							}
							editMode
							rows={9}
							columns={9}
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
