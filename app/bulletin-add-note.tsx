import React, { useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Pressable, StyleSheet, TextInput, Image, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { NoteEditBar } from '@/components/bulletin-edit-bar';
import { StickyNote } from '@/components/sticky-note';
import { useNotes } from '@/components/NoteContext';
import { NoteData } from '@/components/NoteContext';
import { auth } from '@/src/firebase/config';
import { addStickyNote, updateStickyNoteText } from '@/src/firebase/stickynotes';

type ColorOptions = '#EFCB8C' | '#CAC1C6' | '#CCD4BF' | '#C7CFD1' | '#EFDBD4';


export default function AddNote() {
    const navigation = useNavigation();
    const [selectedColor, setSelectedColor] = useState<ColorOptions>('#EFCB8C');
    const [value, onChangeText] = useState('');
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [noteText, setNoteText] = useState('');
    
    const params = useLocalSearchParams<{ boardOwnerUid: string; id?: string }>();

    const colors: ColorOptions[] = ['#EFCB8C', '#CAC1C6', '#CCD4BF', '#C7CFD1','#EFDBD4'];
                                 //[ yellow,    purple,     green,      blue,     pink ]

    const currentUser = auth.currentUser;
    const boardOwnerUid = params.boardOwnerUid || currentUser?.uid;
    const noteId = params.id;

    const handleSave = async () => {
        try {
            if (!currentUser || !boardOwnerUid) {
                Alert.alert('Error', 'Missing user info.');
                return;
            }

            const trimmed = value.trim();
            if (!trimmed) {
                Alert.alert('Error', 'Note cannot be empty.');
                return;
            }

            if (noteId) {
                await updateStickyNoteText(boardOwnerUid, noteId, trimmed, selectedColor);
            } else {
                await addStickyNote(boardOwnerUid, {
                    text: trimmed,
                    color: selectedColor,
                    authorUid: currentUser.uid,
                    top: 20,
                    left: 20,
                });
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving note:', error);
            Alert.alert('Error', 'Could not save note.');
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={styles.container}>
                <View className="absolute top-0 w-full h-14 bg-bulletin-border"/>
                <Pressable
                    onPress={() => navigation.goBack()}
                    className="absolute top-24 left-5 "
                    >
                    <Image 
                        source={require('../figma-icons/arrow-left-circle.png') }
                        className="w-16 h-16"
                    />
                </Pressable>

                {/* Sticky note */}
                <View className="relative w-full h-full items-center top-48"> 
                    <StickyNote 
                        color={selectedColor}
                        changeText={onChangeText}
                    />
                </View>

                {/* Buttons to change note color */}
                <View className="flex-row absolute bottom-80 left-10 w-full">
                {colors.map((color) => {
                    const isSelected = selectedColor  === color;
                    
                    return (
                        <Pressable
                            key={color}
                            onPress={() => setSelectedColor(color)}
                            className={`m-1 w-16 h-16 rounded-full shadow-sm shadow-slate-600 border-2 
                                ${isSelected ?  'border-black' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                        />
                    );
                })}
                </View> 

                <View className="absolute -bottom-40 m-36">
                     <NoteEditBar 
                        onSave={handleSave}
                        text={value} 
                        color={selectedColor}
                        />
                </View>

            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#B9A394',
    },
    text: {
        color: 'black',
        fontFamily: 'Verdana',
        fontSize: 20,
        padding: 5,
        marginTop: 45,
        marginLeft: 10,
    },
})