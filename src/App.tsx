import "./App.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
	const { isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } =
		useAuth0();
	const {
		user: firebaseUser,
		loading: isFirebaseAuthLoading,
		error: firebaseAuthError,
	} = useFirebaseAuth();

	return (
		<HashRouter>
			<Routes>
				<Route
					path="/"
					element={
						<Home
							isAuthenticated={isAuth0Authenticated && !!firebaseUser}
							isAuthLoading={isAuth0Loading || isFirebaseAuthLoading}
							firebaseUser={firebaseUser}
							firebaseAuthError={firebaseAuthError}
						/>
					}
				/>
				<Route path="/login" element={<Login />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
