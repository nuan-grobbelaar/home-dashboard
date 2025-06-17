import "./App.css";
import LoginButton from "./components/header/auth/LoginButton";
import LogoutButton from "./components/header/auth/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
	const { user, getIdTokenClaims } = useAuth0();

	getIdTokenClaims().then((c) => console.log(c));

	return (
		<>
			<div>{user ? <LogoutButton /> : <LoginButton />}</div>
		</>
	);
}

export default App;
