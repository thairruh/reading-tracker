import { auth, db } from "./config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export type ProfileData = {
    username: string;
    bio: string;
    favoriteBook: string;
    currentlyReading: string;
    photoUrl: string;
};

function requireUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");
    return user;
}

export async function getCurrentUserProfile(): Promise<ProfileData> {
    const user = requireUser();
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error("User doc missing");

    const data = snap.data();

    return {
        username: data.username ?? "",
        bio: data.bio ?? "",
        favoriteBook: data.favoriteBook ?? "",
        currentlyReading: data.currentlyReading ?? "",
        photoUrl: data.photoUrl ?? "",
    };
}

export async function updateCurrentUserProfile(updates: Partial<ProfileData>) {
    const user = requireUser();
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, updates);
}