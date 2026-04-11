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

export type CreateJournalEntryResult = {
    entryId: string;
    gemsAwarded: number;
    rewardReason: string;
    unlockedStickerIds: string[];
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
export async function createJournalEntry(
    entry: JournalEntry
    ): Promise<CreateJournalEntryResult> {
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

    const rewardResult = await awardJournalEntryRewards(
        entry.userId,
        entry.date,
        entry.pagesRead
    );

    return {
        entryId: docRef.id,
        gemsAwarded: rewardResult.gemsAwarded,
        rewardReason: rewardResult.rewardReason,
        unlockedStickerIds: rewardResult.unlockedStickerIds,
    };
}

async function awardJournalEntryRewards(
    userId: string,
    entryDate: string,
    pagesRead: number
    ): Promise<{
    gemsAwarded: number;
    rewardReason: string;
    unlockedStickerIds: string[];
    }> {
    const userRef = doc(db, "users", userId);

    const selectedDateKey = getDateKey(entryDate);
    const todayKey = getDateKey(new Date());

    return runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
        throw new Error("User document does not exist");
        }

        const userData = userSnap.data();
        const rewardedJournalDates = userData.rewardedJournalDates ?? {};
        const unlockedStickers = userData.unlockedStickers ?? {};

        let gemsToAward = 0;
        let rewardReason = "Check back tomorrow or log a new day to earn more gems!";

        if (!rewardedJournalDates[selectedDateKey]) {
        if (selectedDateKey === todayKey) {
            gemsToAward = 25;
            rewardReason = "You filled your first entry for today! Come back daily to earn more gems.";
        } else if (selectedDateKey < todayKey) {
            gemsToAward = 10;
            rewardReason = "You filled an entry for a past day! Earned fewer gems than a same-day entry, but it's great that you logged it.";
        } else {
            gemsToAward = 0;
            rewardReason = "Future-dated entries do not earn gems.";
        }
        } else {
        gemsToAward = 0;
        rewardReason = "Check back tomorrow or log a new day to earn more gems!";
        }

        const updatedRewardedDates =
        gemsToAward > 0
            ? { ...rewardedJournalDates, [selectedDateKey]: true }
            : rewardedJournalDates;

        const unlockedStickerIds: string[] = [];
        const updatedUnlockedStickers = { ...unlockedStickers };

        if (!updatedUnlockedStickers.first_entry) {
        updatedUnlockedStickers.first_entry = true;
        unlockedStickerIds.push("first_entry");
        }

        transaction.update(userRef, {
        gems: increment(gemsToAward),
        totalPagesRead: increment(pagesRead),
        rewardedJournalDates: updatedRewardedDates,
        unlockedStickers: updatedUnlockedStickers,
        });

        return {
        gemsAwarded: gemsToAward,
        rewardReason,
        unlockedStickerIds,
        };
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

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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