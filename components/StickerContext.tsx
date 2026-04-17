import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { ImageSourcePropType } from 'react-native';

export interface StickerData {
    id: number;
    image: ImageSourcePropType;
    top: number;
    left: number;
}

//Defines what the Context provides
interface StickerContextType {
    stickers: StickerData[];
    addSticker: (newSticker: StickerData) => void;
    editSticker: (id: number, updatedFields: Partial<StickerData>) => void;
    deleteSticker: (id: number) => void;
    handleStickerPosition: (id: number,  x: number, y: number) => void;
}

const StickerContext = createContext<StickerContextType | undefined>(undefined);

//Provider component so other screens can access Sticker data
export const StickerProvider = ( { children }: { children: ReactNode }) => {
    const [stickers, setStickers] = useState<StickerData[]>([]);

    //Function to add new Sticker to existing list of data   
    const addSticker = (newSticker: StickerData) => {

        setStickers((prev) => [...prev, newSticker]);
    };

    const editSticker = (id: number, updatedFields: Partial<StickerData>) => {
        setStickers((prevStickers => prevStickers.map(sticker => sticker.id === id ? {...sticker, ...updatedFields } : sticker)
    ));
    };

    //.filter creates a new list of data without selected Sticker -> "deletes" it
    const deleteSticker = (id: number) => {
        setStickers((prevSticker) => prevSticker.filter((sticker) => sticker.id !== id));
    }; 

    const handleStickerPosition = (id: number, x: number, y: number ) => {
        setStickers((prevSticker) => prevSticker.map((sticker) => sticker.id === id ? {...sticker, x, y } : sticker));
    };

    return (
        <StickerContext.Provider value={ { stickers, addSticker, editSticker, deleteSticker, handleStickerPosition } }>
            { children }
        </StickerContext.Provider>
    );
};

export const useStickers = () => {
    const context = useContext(StickerContext);
    if(!context) {
        throw new Error('useStickers() must be used within StickerProvider');
    }
    return context;
};