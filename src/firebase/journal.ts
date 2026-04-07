import { addDoc, collection, doc, getDocs, query, where, orderBy, serverTimestamp, updateDoc, deleteDoc, } from "firebase/firestore";
import { db } from "./config";

export type JournalEntry = {
    userId: string;
    book: string;
    pagesRead: number;
    date: string; 
    isPrivate: boolean;
    notes: string;
};

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
    return docRef.id;
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