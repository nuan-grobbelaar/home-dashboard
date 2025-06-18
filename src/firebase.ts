import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCV9KLDUWG25081Nz_DwxCwrYFA1qi82_U",
	authDomain: "dashboard-41ee0.firebaseapp.com",
	projectId: "dashboard-41ee0",
	storageBucket: "dashboard-41ee0.firebasestorage.app",
	messagingSenderId: "576683404898",
	appId: "1:576683404898:web:d45dd398286841f11eeb3b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const functions = getFunctions(app);
