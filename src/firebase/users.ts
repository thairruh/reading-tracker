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

export type UserData = {
    gems: number;
    totalPagesRead: number;
    currentStreak: number;
    longestStreak: number;
    rewardedJournalDates: Record<string, boolean>;
    unlockedStickers: Record<string, boolean>;
};

export async function getUserDocument(userId: string): Promise<UserData | null> {
    const ref = doc(db, "users", userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return snapshot.data() as UserData;
}