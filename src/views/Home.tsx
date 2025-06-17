import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import LogoutButton from "../components/auth/LogoutButton";
import WidgetGrid from "../components/widget/WidgetGrid";
import Widget from "../components/widget/Widget";

const Home = () => {
	const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
	getAccessTokenSilently().then((c) => console.log(c));

	return isLoading ? (
		<div>Loading...</div>
	) : isAuthenticated ? (
		<div className="dashboard">
			<WidgetGrid columns={5} rows={5}>
				<Widget colStart={1} rowStart={1} colEnd={2} rowEnd={3}></Widget>
				<Widget colStart={2} rowStart={3} colEnd={5} rowEnd={5}></Widget>
			</WidgetGrid>
			{/* <LogoutButton /> */}
		</div>
	) : (
		<Navigate to="/login" />
	);
};

export default Home;
