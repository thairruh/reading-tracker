import { useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View, Image, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import EditBar from '../components/bulletin-edit-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StickyNote } from '@/components/sticky-note';
import { useNotes } from '@/components/NoteContext';


interface PositionNote {
  id: number;
  top: number;
  left: number;
}

export default function Bulletin() {
    const navigation = useRouter();
    const [isVisible, setIsVisible] = React.useState(false);
    const [noteText, setNoteText] = useState('');
    const [selectedNote, setSelectedNote] = useState<number | null>(null);
    const { deleteNote } = useNotes();

    const closeEditBar = () => {
        setIsVisible(false);
        setSelectedNote(null);
    };

    const editNote = () => {
        if(selectedNote) {
            navigation.navigate(`/bulletin-add-note?id=${selectedNote}`);
        }   
    }
    const handleDelete = () => {
        if(selectedNote) {
            deleteNote(selectedNote);
            setSelectedNote(null);
        }
    }

    // const addNote = () => {
    //     const newNote = {
    //         id: Date.now(),
    //         top: Math.floor(Math.random() * (288 - 80)),
    //         left: Math.floor(Math.random() * (300 - 80) + 20),
    //     };
    //     addNote(newNote);
    //     setNote(prev => [...prev, newNote]);        
    // };

  const { notes } = useNotes();
  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View className="relative bg-light-pink">
      
        <Pressable
        onPress={() => navigation.replace('/DeskScreen')}
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
            }}
                className="absolute inset-0 w-full h-72 bg-bulletin-board border-[10px] border-bulletin-border overflow-visible"
            />
            <View className="absolute inset-0">
                {notes.map((note) => {
                    const isSelected = selectedNote === note.id;

                    return (
                   <Pressable 
                        key={note.id}
                        onPress={() => {
                        setIsVisible(true); 
                        setSelectedNote(note.id); }}
                        style={{
                            position: 'absolute',
                            top: note.top,
                            left: note.left,
                            zIndex: isSelected ? 10 : 1, //move selected note to the front
                        }}
                    >
                        { /* Outline selected note */ }
                        <View className={`${isSelected ? 'border-2 border-black' : 'border-transparent'}`}>
                        <StickyNote
                            isEditable={false}
                            key={note.id} 
                            {...note}
                            variant="small"
                         />
                          </View>
                    </Pressable>
                    );
                    })}
                </View>
            </View>

             {/* Make Edit Bar visible when bulletin is pressed */}
            {isVisible && (
                <View className="flex-row absolute bottom-0 ml-10 w-full h-full">
                    <EditBar/>

                    {/* If a note is selected while edit bar is visible */}
                    {selectedNote && (
                        <EditBar 
                            deletePressed={handleDelete}
                            editPressed={editNote} 
                            donePressed={closeEditBar} 
                        />
                    )}
                    
                </View>
            )}
          

            
        </View>
    
    </TouchableWithoutFeedback>
  );
};