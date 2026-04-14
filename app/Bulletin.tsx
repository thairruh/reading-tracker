import { useNavigation, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Pressable, View, Image, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated, PanResponder } from "react-native";
import EditBar from '../components/bulletin-edit-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StickyNote } from '@/components/sticky-note';
import { useNotes } from '@/components/NoteContext';
import { DragNote } from '@/components/DragNote';

interface PositionNote {
  id: number;
  top: number;
  left: number;
}

export default function Bulletin() {
    const router = useRouter();
    const navigation = useNavigation();
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
            router.navigate(`/bulletin-add-note?id=${selectedNote}`);
        }   
    }
    const handleDelete = () => {
        if(selectedNote) {
            deleteNote(selectedNote);
            setSelectedNote(null);
        }
    }
    
    // const pan = useRef(new Animated.ValueXY()).current;

    // const panResponder = useRef(PanResponder.create({
    //     onMoveShouldSetPanResponder: () => true,
    //     onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
    //     onPanResponderRelease: () => {
    //         Animated.spring(
    //             pan,
    //             {toValue: { x: 0, y: 0}, useNativeDriver: false}
    //         ).start();
    //     },
    // }),
    // ).current;
    //     const pan = useRef(new Animated.ValueXY()).current;
       
    //     const panResponder = useRef(PanResponder.create({
    //         onStartShouldSetPanResponder: () => false,
    //         onMoveShouldSetPanResponder: (_, gestureState) => {
    //             return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    //         },
    //         onPanResponderGrant: () => {
    //             pan.setOffset({
    //                 x: pan.x._value,
    //                 y: pan.y._value,
    //             });
    //             pan.setValue({ x: 0, y: 0 });
    //         },
    //         onPanResponderMove: Animated.event(
    //             [null, { dx: pan.x, dy: pan.y }],
    //             {useNativeDriver: false}
    //         ),
    //         onPanResponderRelease: () => {
    //             pan.flattenOffset();
    //         },
    //     })
    // ).current;
        // const translateY = useRef(new Animated.Value(0)).current;
        // const DragNote = () => {
        //     Animated.timing(pan, {
        //         toValue: {x: 50, y: 50},
        //         duration: 1000,
        //         useNativeDriver: true,
        //     }).start();
        // };
    

  const { notes, handleNotePosition } = useNotes();
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
            }}
                className="absolute inset-0 w-full h-72 bg-bulletin-board border-[10px] border-bulletin-border overflow-visible"
            />
            <View className="absolute inset-0">
                {notes.map((note) => {
                    const isSelected = selectedNote === note.id;

                    return (
                   
                //    <Pressable 
                    <DragNote
                        key={note.id}
                        note={note}
                        isSelected={isSelected}
                        onPress={() => {
                        setIsVisible(true); 
                        setSelectedNote(note.id); }}
                        stopDrag={handleNotePosition}
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
                          </DragNote>
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