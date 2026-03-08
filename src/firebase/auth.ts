import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { auth } from "./config";

export async function register(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
}

export async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

export async function logout() {
    await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}