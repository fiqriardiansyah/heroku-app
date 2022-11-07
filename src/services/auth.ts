import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    Auth,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    getIdToken,
} from "firebase/auth";
import { SignInEmail, SignUpEmail } from "../models/data";
import { DEFAULT_ERROR } from "../utils/constant";

class AuthService {
    auth: Auth;

    config: FirebaseApp;

    constructor(config: FirebaseApp) {
        this.config = config;
        this.auth = getAuth(this.config);
    }

    CurrentUser() {
        return this.auth.currentUser;
    }

    async SignUpEmail({ email, password }: SignUpEmail) {
        try {
            const request = await createUserWithEmailAndPassword(this.auth, email, password);
            return request;
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }

    async SignInEmail({ email, password }: SignInEmail) {
        try {
            const request = await signInWithEmailAndPassword(this.auth, email, password);
            return request;
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }

    async SignInGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const request = await signInWithPopup(this.auth, provider);
            return request;
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }

    async Logout() {
        try {
            const request = signOut(this.auth);
            return request;
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }
}

const authService = new AuthService(configFirebase.app);

export default authService;
