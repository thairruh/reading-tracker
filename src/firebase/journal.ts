import { addDoc, collection, doc, getDoc, getDocs, query, where, orderBy, serverTimestamp, updateDoc, deleteDoc, runTransaction, increment, } from "firebase/firestore";
import { db } from "./config";

export type JournalEntry = {
    userId: string;
    book: string;
    pagesRead: number;
    date: string; 
    isPrivate: boolean;
    notes: string;
};

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

// create entry
export async function createJournalEntry(entry: JournalEntry) {
    const docRef = await addDoc(collection(db, "journalEntries"), {
        userId: entry.userId,
        book: entry.book,
        pagesRead: entry.pagesRead,
        date: entry.date,
        isPrivate: entry.isPrivate,
        notes: entry.notes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await awardJournalEntryGems(entry.userId, entry.date, entry.pagesRead);

    return docRef.id;
}

async function awardJournalEntryGems(userId: string, entryDate: string, pagesRead: number) {
    const userRef = doc(db, "users", userId);

    const selectedDateKey = getDateKey(entryDate);
    const todayKey = getDateKey(new Date());

    await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
            throw new Error("User document does not exist");
        }

        const userData = userSnap.data();
        const rewardedJournalDates = userData.rewardedJournalDates ?? {};

        // already rewarded for this date
        if (rewardedJournalDates[selectedDateKey]) {
            transaction.update(userRef, {
                totalPagesRead: increment(pagesRead),
            });
            return;
        }

        let gemsToAward = 0;

        if (selectedDateKey === todayKey) { // if entry is for today, award more gems to encourage daily journaling
            gemsToAward = 25;
        } else if (selectedDateKey < todayKey) { // if entry is for a past date, award some gems but less than a same-day entry
            gemsToAward = 10;
        } else {    // additional entries for the same date should not award extra gems
            gemsToAward = 0;
        }

        const updatedRewardedDates = 
            gemsToAward > 0
            ? { ...rewardedJournalDates, [selectedDateKey]: true }
            : rewardedJournalDates;

            transaction.update(userRef, {
                gems: increment(gemsToAward),
                totalPagesRead: increment(pagesRead),
                rewardedJournalDates: updatedRewardedDates,
                });
            });
        }

// get all user entries
export async function getUserJournalEntries(userId: string) {
    const q = query(
        collection(db, "journalEntries"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(),}));
}

// get one entry
export async function getJournalEntryById(entryId: string) {
    const ref = doc(db, "journalEntries", entryId);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };
}

// update entry
export async function updateJournalEntry(
    entryId: string,
    updates: Partial<JournalEntry>
) {
    const ref = doc(db, "journalEntries", entryId);

    await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}


// delete entry
export async function deleteJournalEntry(entryId: string) {
    const ref = doc(db, "journalEntries", entryId);
    await deleteDoc(ref);
}