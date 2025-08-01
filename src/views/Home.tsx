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
	isMobile: boolean;
}

const Home = ({ isLoading, setError, setLoading, isMobile }: HomeProps) => {
	useFirebaseAuth(setError);

	const { activeLayout, saveWidget, deleteWidget } = useWidgetGridStore(
		setLoading,
		setError,
		isMobile
	);

	if (isLoading.isLoading) {
		return (
			<div className="page-status">
				<LoadingBar message={isLoading.message} />
			</div>
		);
	}

	return (
		<div className="dashboard" data-mobile={isMobile}>
			{/* <LogoutButton /> */}
			{activeLayout && (
				<Grid
					ItemComponent={Widget}
					columns={activeLayout.columns}
					rows={activeLayout.rows}
					onSaveGridItem={(item: WidgetCreationData) => {
						saveWidget(activeLayout.id, item);
					}}
					setError={setError}
					mobile={isMobile}
					editMode={false}
				>
					{activeLayout.widgets.map((widget: WidgetDocument) => (
						<Widget
							key={getWidgetId(widget)}
							{...widget}
							removeItem={(id?: string) =>
								id ? deleteWidget(activeLayout.id, id) : null
							}
							dbRef={widget.dbRef}
							setError={setError}
							isMobile={isMobile}
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
