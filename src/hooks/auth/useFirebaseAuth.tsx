import { useState, useEffect, useCallback } from "react";
import { httpsCallable } from "firebase/functions";
import { signInWithCustomToken } from "firebase/auth";
import type { User } from "firebase/auth";
import { useAuth0 } from "@auth0/auth0-react";
import { auth, functions } from "../../firebase";

interface Auth0ToFirebaseRequest {
	token: string;
}

interface Auth0ToFirebaseResponse {
	firebaseToken: string;
}

export function useFirebaseAuth(setError: (error: String | null) => void) {
	const { getAccessTokenSilently } = useAuth0();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);

	const signInWithAuth0Token = useCallback(async (auth0Token: string) => {
		if (!auth0Token) {
			setUser(null);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			console.log("trying");
			const auth0ToFirebase = httpsCallable<
				Auth0ToFirebaseRequest,
				Auth0ToFirebaseResponse
			>(functions, "auth0ToFirebase");

			const result: { data: Auth0ToFirebaseResponse } = await auth0ToFirebase({
				token: auth0Token,
			});
			const firebaseToken = result.data.firebaseToken;

			const firebaseUserCredential = await signInWithCustomToken(
				auth,
				firebaseToken
			);

			setUser(firebaseUserCredential.user);
		} catch (err: any) {
			console.log(err);
			setError(err);
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const trySignIn = async () => {
			try {
				const auth0Token = await getAccessTokenSilently();
				if (auth0Token) {
					console.log("auth token");
					await signInWithAuth0Token(auth0Token);
				}
			} catch (err) {
				console.error("Auth0 token retrieval failed", err);
			}
		};

		trySignIn();
	}, [getAccessTokenSilently, signInWithAuth0Token]);

	return { user, loading };
}
