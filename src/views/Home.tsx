import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import LogoutButton from "../components/auth/LogoutButton";

const Home = () => {
	const { isAuthenticated, isLoading } = useAuth0();
	console.log(isAuthenticated, isLoading);

	return isLoading ? (
		<div>Loading...</div>
	) : isAuthenticated ? (
		<>
			<div>Home</div>
			<LogoutButton />
		</>
	) : (
		<Navigate to="/login" />
	);
};

export default Home;
