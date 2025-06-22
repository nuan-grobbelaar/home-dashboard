import WidgetGrid from "../components/widget/WidgetGrid";
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

	const { activeLayout, saveWidget } = useWidgetGridStore(
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
				<WidgetGrid
					columns={activeLayout.columns}
					rows={activeLayout.rows}
					onWidgetTypeSelect={(widget: WidgetData) => {
						saveWidget(activeLayout.id, widget);
					}}
				>
					{activeLayout.widgets.map((widget: WidgetProps) => (
						<Widget key={getWidgetId(widget)} {...widget} editMode>
							{widget.type}
						</Widget>
					))}
				</WidgetGrid>
			)}
		</div>
	);
};

export default Home;
