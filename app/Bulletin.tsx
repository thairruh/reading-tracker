import { useNavigation, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, View, Image, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated, PanResponder, ImageSourcePropType } from "react-native";
import EditBar from '../components/bulletin-edit-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StickyNote } from '@/components/sticky-note';
import { useNotes } from '@/components/NoteContext';
import { DragNote } from '@/components/DragNote';
import sticker1 from '../assets/stickers/first-entry.png';
import sticker2 from '../assets/stickers/first-friend.png';
import AddSticker from '@/components/add-sticker';
import { useStickers } from '@/components/StickerContext';

interface PositionNote {
  id: number;
  top: number;
  left: number;
}
interface StickerData {
    id: number;
    image: ImageSourcePropType;
    top: number;
    left: number;
}

export default function Bulletin() {
    const router = useRouter();
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = React.useState(false);
    const [noteText, setNoteText] = useState('');
    const [selectedNote, setSelectedNote] = useState<number | null>(null);
    const [stickerVisible, setStickerVisible] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState<number | null>(null);
    //const [stickers, setStickers] = useState<StickerData[]>([]);
    
    const { deleteNote } = useNotes();
    const { deleteSticker, addSticker } = useStickers();

    const closeEditBar = () => {
        setIsVisible(false);
        setStickerVisible(false);
        setSelectedNote(null);
        setSelectedSticker(null);
    };

    const editNote = () => {
        if(selectedNote) {
            router.navigate(`/bulletin-add-note?id=${selectedNote}`);
        }   
    }
    const handleDelete = () => {
        if(selectedNote !== null) {
            deleteNote(selectedNote);
            setSelectedNote(null);
        }
        if(selectedSticker !== null) {
            deleteSticker(selectedSticker);
            setSelectedSticker(null);
        }
    }
      const [user, setUser] = useState({ 
        stickers: [
            { id: 1, image: sticker1 },
            { id: 2, image: sticker2 },
        ],
});
//         <View style={{ width: '90%', height: 100, backgroundColor:'#EEDBD3', marginBottom: 20, flexDirection:'row'}}>
//             {user.stickers.map((sticker) => (
//                 <Image
//                     key={sticker.id}
//                     source={sticker.image}
//                     style={{
//                     width: 60,
//                     height: 60,
//                     marginLeft: 20,
//                     marginTop: 20
//                     }}/>
//             ))}
//         </View>
    const showStickers = () => {
        setStickerVisible(true);
    }    
    const handleStickers = (imgSource: any) => {
        const newSticker: StickerData = {
            id: Date.now(),
            image: imgSource,
            top: 50,
            left: 50,
        };
       addSticker(newSticker);
    };

  const { notes, handleNotePosition } = useNotes();
  const { stickers, handleStickerPosition } = useStickers();
  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="relative bg-light-pink">
      
        <Pressable
        onPress={() => router.replace('/DeskScreen')}
        className="absolute top-16 left-5 "
        >
            <Image 
                source={require('../figma-icons/arrow-left-circle.png') }
                className="w-16 h-16"
            />
        </Pressable>

        {/* Bulletin Board */}
        <View className=" top-1/3 w-full h-full">
            <Pressable
            onPress={() => {
                setIsVisible(true);
                setSelectedNote(null);
                setSelectedSticker(null);
            }}
                className="absolute inset-0 w-full h-72 bg-bulletin-board border-[10px] border-bulletin-border overflow-visible"
            />
            <View className="absolute inset-0">
                {notes.map((note) => {
                    const isSelected = selectedNote === note.id;

                    return (
                    <DragNote
                        key={note.id}
                        note={note}
                        isSelected={isSelected}
                        onPress={() => {
                        setIsVisible(true); 
                        setSelectedNote(note.id); 
                        setSelectedSticker(null);
                        }}
                        stopDrag={handleNotePosition}
                    >
                        { /* Outline selected note */ }
                        <View className={`${isSelected ? 'border-2 border-black' : 'border-transparent'} z-10`}>
                            <StickyNote
                                isEditable={false}
                                key={note.id} 
                                {...note}
                                variant="small"
                            />
                        </View>
                    </DragNote>
                    );
                })}

                { /* Display sticker(s) on bulletin */}
                {stickers.map((sticker) => {
                    const isSelected = selectedSticker === sticker.id;
                    return (
                        <DragNote
                            key={sticker.id}
                            note={sticker}
                            isSelected={isSelected}
                            onPress={() => {
                                setIsVisible(true);
                                setSelectedSticker(sticker.id);
                                setSelectedNote(null);
                            }}
                            stopDrag={handleStickerPosition}
                        >
                        <View
                            //key={sticker.id}
                            style={{
                            //position: 'absolute',
                            top: sticker.top,
                            left: sticker.left,
                            //zIndex: 20,
                        }}>
                        <View className={`${isSelected ?'border-2 border-black' : 'border-transparent'} z-10`}>
                            <Image 
                            source={sticker.image}
                            style={{
                            width: 60,
                            height: 60,
                            }}/>
                            </View>
                        </View>
                        </DragNote>
                    );
                })}
                </View>
            </View>

             {/* Make Edit Bar visible when bulletin is pressed */}
            {isVisible && (
                <View className="flex-row absolute bottom-0 ml-10 w-full h-full">
                    <EditBar  key={selectedSticker || selectedNote} donePressed={closeEditBar} stickersPressed={showStickers}/>

                    {/* Allow these actions if a note is selected while edit bar is visible */}
                    { (selectedNote || selectedSticker) && (
                        <EditBar 
                            deletePressed={handleDelete}
                            editPressed={editNote} 
                            donePressed={closeEditBar}
                        />
                    )}
                    {/* Handling Stickers */}
                    {stickerVisible && (
                        <View className="absolute ml-0 w-full h-full">
                            <View 
                                style={{ position: 'absolute', width: '88%', height: 100, backgroundColor:'#EEDBD3', marginBottom: 20, flexDirection:'row'}}
                                className="ml-0 top-44 right-[60px] rounded-[10px] border-hairline border-brown">
                        <AddSticker
                            user={user}
                            onAdd={handleStickers}
                        />
                        </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    </TouchableWithoutFeedback>
  );
};