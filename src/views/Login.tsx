import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/header/auth/LogoutButton";
import LoginButton from "../components/header/auth/LoginButton";

const Login = () => {
	const { isAuthenticated } = useAuth0();

	return <div>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</div>;
};

export default Login;
