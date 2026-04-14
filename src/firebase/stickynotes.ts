import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, } from "firebase/firestore";
import { db } from "./config";

export type StickyNote = {
    id: string;
    text: string;
    color: string;
    top: number;
    left: number;
    authorUid: string;
    createdAt?: any;
    updatedAt?: any;
};

export function subscribeToStickyNotes(
  boardOwnerUid: string,
  callback: (notes: StickyNote[]) => void
) {
  const notesRef = collection(db, "users", boardOwnerUid, "stickyNotes");
  const q = query(notesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<StickyNote, "id">),
    }));
    callback(notes);
  });
}

export async function addStickyNote(
  boardOwnerUid: string,
  note: {
    text: string;
    color: string;
    top?: number;
    left?: number;
    authorUid: string;
  }
) {
  const notesRef = collection(db, "users", boardOwnerUid, "stickyNotes");

  await addDoc(notesRef, {
    text: note.text,
    color: note.color,
    top: note.top ?? 20,
    left: note.left ?? 20,
    authorUid: note.authorUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateStickyNotePosition(
  boardOwnerUid: string,
  noteId: string,
  top: number,
  left: number
) {
  const noteRef = doc(db, "users", boardOwnerUid, "stickyNotes", noteId);

  await updateDoc(noteRef, {
    top,
    left,
    updatedAt: serverTimestamp(),
  });
}

export async function updateStickyNoteText(
  boardOwnerUid: string,
  noteId: string,
  text: string,
  color: string
) {
  const noteRef = doc(db, "users", boardOwnerUid, "stickyNotes", noteId);

  await updateDoc(noteRef, {
    text,
    color,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteStickyNote(
  boardOwnerUid: string,
  noteId: string
) {
  const noteRef = doc(db, "users", boardOwnerUid, "stickyNotes", noteId);
  await deleteDoc(noteRef);
}