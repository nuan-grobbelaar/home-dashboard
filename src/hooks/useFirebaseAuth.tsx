import { useState, useEffect, useCallback } from "react";
import { httpsCallable } from "firebase/functions";
import { signInWithCustomToken } from "firebase/auth";
import type { User } from "firebase/auth";
import { useAuth0 } from "@auth0/auth0-react";
import { auth, functions } from "../firebase";

interface Auth0ToFirebaseRequest {
	token: string;
}

interface Auth0ToFirebaseResponse {
	firebaseToken: string;
}

export function useFirebaseAuth() {
	const { getAccessTokenSilently } = useAuth0();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const signInWithAuth0Token = useCallback(async (auth0Token: string) => {
		if (!auth0Token) {
			setUser(null);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const auth0ToFirebase = httpsCallable<
				Auth0ToFirebaseRequest,
				Auth0ToFirebaseResponse
			>(functions, "auth0ToFirebase");

			// Call your cloud function with the Auth0 token
			const result: { data: Auth0ToFirebaseResponse } = await auth0ToFirebase({
				token: auth0Token,
			});
			const firebaseToken = result.data.firebaseToken;

			// Sign in to Firebase with the custom token
			const firebaseUserCredential = await signInWithCustomToken(
				auth,
				firebaseToken
			);

			setUser(firebaseUserCredential.user);
		} catch (err: any) {
			setError(err);
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	// Call it whenever auth0Token changes
	useEffect(() => {
		let isMounted = true;

		const trySignIn = async () => {
			try {
				const auth0Token = await getAccessTokenSilently();
				if (isMounted && auth0Token) {
					await signInWithAuth0Token(auth0Token);
				}
			} catch (err) {
				console.error("Auth0 token retrieval failed", err);
				if (isMounted) {
					setError(err as Error);
					setUser(null);
				}
			}
		};

		trySignIn();

		return () => {
			isMounted = false;
		};
	}, [getAccessTokenSilently, signInWithAuth0Token]);

	return { user, loading, error };
}
