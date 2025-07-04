import { useCallback, useEffect, useState } from "react";
import { useWidgetGridStore } from "../hooks/firestore/useWidgetGridStore";
import { useFirebaseAuth } from "../hooks/auth/useFirebaseAuth";
import type {
	WidgetCreationData,
	WidgetDocument,
} from "../hooks/firestore/types";
import Grid from "../components/widget-grid-infrastructure/Grid";
import Widget, {
	getWidgetId,
	type LoadingState,
} from "../components/widget-grid-infrastructure/Widget";
import LoadingBar from "../components/widget-grid-infrastructure/LoadingBar";

export interface HomeProps {
	isLoading: LoadingState;
	setLoading: (loading: LoadingState) => void;
	setError: (error: String | null) => void;
}

const Home = ({ isLoading, setError, setLoading }: HomeProps) => {
	useFirebaseAuth(setError);

	const { activeLayout, saveWidget, deleteWidget } = useWidgetGridStore(
		setLoading,
		setError
	);

	if (isLoading.isLoading) {
		return (
			<div className="page-status">
				<LoadingBar message={isLoading.message} />
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
