import React, { useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { StyleSheet, Image, Text, View, Pressable } from "react-native";
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { useNotes } from './NoteContext';

interface EditBarProps {
    addNotePressed?: () => void;
    donePressed?: () => void;
    editPressed?: () => void;
    deletePressed?: () => void;
    text?: string;
    color?: string;
}

export const EditBar = ({ addNotePressed, donePressed, editPressed, deletePressed }: EditBarProps) => {
    const router = useRouter();

    return (
        <View className="flex-row absolute bottom-56 w-full">
            <Pressable 
                onPress={deletePressed}
                style={styles.buttonstyle} 
                className="border-r-hairline"
            >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/delete.png')}
                />
                <Text style={styles.text}>Delete</Text>
            </Pressable>

            <Pressable 
                onPress={() => router.navigate('/bulletin-add-note')}
                style={styles.buttonstyle} 
                className="border-l-0 border-r-hairline"
                >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/add_box.png')}
                />                
                <Text style={styles.text}>Add Note</Text>
            </Pressable>

            <Pressable 
                onPress={editPressed}
                style={styles.buttonstyle} 
                className="border-l-0 border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/edit.png')}
                />                
                <Text style={styles.text}>Edit Note</Text>
            </Pressable>

            <Pressable 
                style={styles.buttonstyle} 
                className="border-l-0 border-r-hairline"
                >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/add_sticker.png')}
                />    
                <Text style={styles.text}>Stickers</Text>
            </Pressable>

            <Pressable  
                onPress={donePressed} 
                style={styles.buttonstyle}
                className="border-l-0"
            >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/check.png')}
                />    
                <Text style={styles.text}>Done</Text>
            </Pressable>

        </View>
    );
}

export const NoteEditBar = ({ donePressed, text, color }: EditBarProps) => {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const { notes, editNote, addNote } = useNotes();
    const existingNote = notes.find(n => n.id.toString() === id);

    const [noteText, setNoteText] = useState(existingNote?.text || "");
    const [noteColor, setNoteColor] = useState(existingNote?.color || '#EFCB8C');

    const handleDone = () => { 
        //If note has id & exists, edit the note's attributes when 'done' is pressed
        if(id) {
            editNote(Number(id), {text, color});
        } else { //Otherwise create a new note
        const newNote = {
            id: Date.now(),
            text: text,
            color: color,
            // top: Math.floor(Math.random() * (288 - 24 - 20)) + 10,
            // left: Math.floor(Math.random() * (300 - 24 - 20)) + 10,
        };
            addNote(newNote);
        }
        navigation.goBack();
    };    

    return (
        <View className="flex-row absolute bottom-56 w-full">
            <Pressable style={styles.buttonstyle} className="border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/delete.png')}
                />
                <Text style={styles.text}>Delete</Text>
            </Pressable>

            <Pressable  
                onPress={handleDone} 
                style={styles.buttonstyle}
                className="border-l-0"
            >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/check.png')}
                />    
                <Text style={styles.text}>Done</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonstyle: {
        width: 65,
        height: 65,
        backgroundColor: '#EEDBD3',
        borderWidth: 2,
        borderColor: '#472A2A',
    },
    text: {
        marginTop: 'auto',
        textAlign: 'center',
        color: '#472A2A',
        fontWeight: 'bold',
        // fontSize: 12,
    },
    image: {
        // display: 'flex',
        // justifyContent: 'center',
        width: '50%',
        height: 50,
        alignSelf: 'center',
        marginBottom: -10,
        resizeMode: 'contain',
        
    }
})

export default EditBar;

