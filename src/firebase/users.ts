import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";

export async function createUserDocument(user: User) {
    await setDoc(
        doc(db, "users", user.uid),
        {
        uid: user.uid,
        email: user.email ?? "",
        username: "",
        createdAt: serverTimestamp(),
        photoUrl: user.photoURL ?? "",
        bio: "",
        gems: 0,
        totalPagesRead: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteBook: "",
        currentlyReading: "",
        rewardedJournalDates: {},
        unlockedStickers: {},
        },
        { merge: true }
    );
}

export async function getUserDocument(uid: string) {
    const ref = doc(db, "users", uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
}