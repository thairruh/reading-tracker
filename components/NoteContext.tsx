import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface NoteData {
    id: number;
    color: string;
    text: string;
    top: number;
    left: number;
}

//Defines what the Context provides
interface NoteContextType {
    notes: NoteData[];
    addNote: (newNote: NoteData) => void;
    editNote: (id: number, updatedFields: Partial<NoteData>) => void;
    deleteNote: (id: number) => void;
    handleNotePosition: (id: number,  x: number, y: number) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

//Provider component so other screens can access note data
export const NoteProvider = ( { children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<NoteData[]>([]);

    //Function to add new note to existing list of data   
    const addNote = (newNote: NoteData) => {

        setNotes((prev) => [...prev, newNote]);
    };

    const editNote = (id: number, updatedFields: Partial<NoteData>) => {
        setNotes((prevNotes => prevNotes.map(note => note.id === id ? {...note, ...updatedFields } : note)
    ));
    };

    //.filter creates a new list of data without selected note -> "deletes" it
    const deleteNote = (id: number) => {
        setNotes((prevNote) => prevNote.filter((note) => note.id !== id));
    }; 

    const handleNotePosition = (id: number, x: number, y: number ) => {
        setNotes((prevNote) => prevNote.map((note) => note.id === id ? {...note, x, y } : note));
    };

    return (
        <NoteContext.Provider value={ {notes, addNote, editNote, deleteNote, handleNotePosition } }>
            { children }
        </NoteContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NoteContext);
    if(!context) {
        throw new Error('useNotes() must be used within NoteProvider');
    }
    return context;
};