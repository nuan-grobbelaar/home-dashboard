import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<Auth0Provider
		domain="dev-g4ors5whpl8izfzj.eu.auth0.com"
		clientId="HlNxH7PrJSEiegWDPJ8aVLFOCV8lU3Zy"
		authorizationParams={{
			redirect_uri: window.location.origin,
		}}
	>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Auth0Provider>
);
