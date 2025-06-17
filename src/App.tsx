import "./App.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
