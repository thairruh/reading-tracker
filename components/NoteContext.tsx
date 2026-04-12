import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface NoteData {
    id: number;
    color: string;
    text: string;
    top: number;
    left: number;
}

interface NoteContextType {
    notes: NoteData[];
    addNote: (newNote: NoteData) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ( { children }: { children: ReactNode }) => {
    const [notes, setNotes] = useState<NoteData[]>([]);

    const addNote = (newNote: NoteData) => {
        setNotes((prev) => [...prev, newNote]);
    };

    return (
        <NoteContext.Provider value={ {notes, addNote} }>
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