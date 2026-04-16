import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
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
        equipped: {},
        totalPagesRead: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: "",
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
    lastStreakDate: string;
    rewardedJournalDates: Record<string, boolean>;
    unlockedStickers: Record<string, boolean>;
};

export async function getUserDocument(userId: string): Promise<UserData | null> {
    const ref = doc(db, "users", userId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return snapshot.data() as UserData;
}

function getDateKey(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function refreshCurrentUserStreak() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const lastStreakDate =
      typeof data.lastStreakDate === "string" ? data.lastStreakDate : "";

    const todayKey = getDateKey(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = getDateKey(yesterday);

    if (
      lastStreakDate &&
      lastStreakDate !== todayKey &&
      lastStreakDate !== yesterdayKey
    ) {
      transaction.update(userRef, {
        currentStreak: 0,
      });
    }
  });
}