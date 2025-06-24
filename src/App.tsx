import "./App.css";
import "./fonts.css";
import Home from "./views/Home";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/auth/LoginButton";

function App() {
	const { isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } =
		useAuth0();

	if (isAuth0Loading) {
		return "Loading...";
	}

	if (!isAuth0Authenticated) {
		return <LoginButton />;
	}

	return <Home />;
}

export default App;
