import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./fonts.css";
import Home from "./views/Home";
import { useAuth0 } from "@auth0/auth0-react";
import type { LoadingState } from "./components/widget-grid-infrastructure/Widget";

function isMobileDevice() {
	return (
		navigator.userAgent.includes("IEMobile") ||
		/android|iphone|ipad|ipod|blackberry|bb10|mini|windows\sce|palm/i.test(
			navigator.userAgent
		)
	);
}

function isMobileViewport() {
	return window.matchMedia("(max-width: 767px)").matches;
}

function App() {
	const {
		loginWithPopup,
		isAuthenticated: isAuth0Authenticated,
		isLoading: isAuth0Loading,
	} = useAuth0();

	const [loading, _setLoading] = useState<LoadingState>({
		isLoading: false,
	});
	const setLoading = useCallback((loading: LoadingState) => {
		_setLoading(loading);
	}, []);

	const [error, _setError] = useState<String | null>(null);
	const setError = useCallback((e: String | null) => {
		console.log("ERROR", error);
		_setError(e);
	}, []);

	useEffect(() => {
		if (!isAuth0Loading && !isAuth0Authenticated) {
			(async () => {
				try {
					await loginWithPopup();
				} catch (err) {
					console.error("Auth0 login failed:", err);
					setError("Authentication failed. Please refresh or try again.");
				}
			})();
		}
	}, [isAuth0Loading, isAuth0Authenticated]);

	const isLoading: LoadingState = useMemo(() => {
		if (isAuth0Loading)
			return { isLoading: isAuth0Loading, message: "Authenticating" };
		else if (loading.isLoading) return loading;
		else return { isLoading: false };
	}, [loading, isAuth0Loading]);

	if (error) {
		return <div className="page-status">{error}</div>;
	}

	const isOnMobileDevice = isMobileDevice() || isMobileViewport();

	return (
		<Home
			isLoading={isLoading}
			setError={setError}
			setLoading={setLoading}
			isMobile={isOnMobileDevice}
		/>
	);
}

export default App;
