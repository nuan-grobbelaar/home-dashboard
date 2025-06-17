import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import LoginButton from "../components/auth/LoginButton";

const Login = () => {
	const { isAuthenticated } = useAuth0();

	return <div>{!isAuthenticated ? <LoginButton /> : <Navigate to="/" />}</div>;
};

export default Login;
