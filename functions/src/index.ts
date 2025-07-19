/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

admin.initializeApp();

const AUTH0_DOMAIN = "dev-g4ors5whpl8izfzj.eu.auth0.com";
const AUTH0_AUDIENCE = "https://panelist.dev/api";

const client = jwksClient({
	jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
});

// Function to get signing key for JWT verification
function getKey(header: JwtHeader, callback: SigningKeyCallback): void {
	if (!header.kid) {
		callback(new Error("No KID found in token header"));
		return;
	}

	client.getSigningKey(header.kid, (err, key) => {
		if (err) {
			callback(err);
			return;
		}
		if (key) {
			const signingKey = key.getPublicKey();
			callback(null, signingKey);
		} else {
			callback(new Error("Key is null"));
		}
	});
}

export const auth0ToFirebase = functions.https.onCall(
	async (data: any, context) => {
		const auth0Token = data.data.token;
		if (typeof auth0Token !== "string") {
			throw new functions.https.HttpsError(
				"invalid-argument",
				`Token must be a string, got: ${data.data.token}`
			);
		}

		try {
			const decoded = await new Promise<any>((resolve, reject) => {
				jwt.verify(
					auth0Token,
					getKey,
					{
						audience: [AUTH0_AUDIENCE],
						issuer: `https://${AUTH0_DOMAIN}/`,
						algorithms: ["RS256"],
					},
					(err, decodedToken) => {
						if (err) return reject(err);

						if (
							typeof decodedToken === "string" ||
							decodedToken === undefined
						) {
							return reject(new Error("Invalid JWT payload"));
						}

						resolve(decodedToken);
					}
				);
			});

			// Use the Auth0 user ID (sub) as Firebase UID
			const uid = decoded.sub;
			if (typeof uid !== "string") {
				throw new functions.https.HttpsError(
					"unauthenticated",
					"Invalid token payload: missing sub"
				);
			}

			// Create Firebase custom token with optional claims
			const firebaseToken = await admin.auth().createCustomToken(uid, {
				email: decoded.email,
				name: decoded.name,
			});

			return { firebaseToken };
		} catch (error) {
			console.error("Auth0 token verification failed:", error);
			throw new functions.https.HttpsError(
				"unauthenticated",
				`Invalid Auth0 token: ${error} - ${auth0Token}`
			);
		}
	}
);
