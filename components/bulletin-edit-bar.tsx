import React, { useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { StyleSheet, Image, Text, View, Pressable } from "react-native";
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { useNotes } from './NoteContext';

interface EditBarProps {
    addNotePressed?: () => void;
    donePressed?: () => void;
    editPressed?: () => void;
    stickersPressed?: () => void;
    deletePressed?: () => void;
    onSave?: () => void;
    text?: string;
    color?: string;
}

export const EditBar = ({ addNotePressed, donePressed, editPressed, stickersPressed, deletePressed }: EditBarProps) => {
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
                onPress={addNotePressed}
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
                onPress={stickersPressed}
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

export const NoteEditBar = ({ onSave }: EditBarProps) => {
    return (
        <View className="absolute bottom-56 w-full">
            {/* <Pressable 
                style={styles.buttonstyle} 
                className="border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/delete.png')}
                />
                <Text style={styles.text}>Delete</Text>
            </Pressable> */}

            <Pressable  
                onPress={onSave} 
                style={styles.buttonstyle}
                className=""
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

export const RedecorateEditBar = ({ cancelEditing, bringForward, pushBack, setStoreItem, setOpenInventory, saveEditing }) => {
    const router = useRouter();

    return (
        <View className="flex-row absolute bottom-20 w-full">
            <Pressable 
                onPress={cancelEditing}
                style={styles.redecorate} 
                className="border-r-hairline"
            >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/crop_rotate.png')}
                />
                <Text style={styles.text}>Cancel</Text>
            </Pressable>

            <Pressable 
                onPress={pushBack}
                style={styles.redecorate} 
                className="border-l-0 border-r-hairline"
            >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/crop_rotate.png')}
                />
                <Text style={[styles.text]}>Back</Text>
            </Pressable>

            <Pressable 
                onPress={bringForward}
                style={styles.redecorate} 
                className="border-l-0 border-r-hairline"
            >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/crop_rotate.png')}
                />
                <Text style={[styles.text ]}>Forward</Text>
            </Pressable>

            <Pressable 
                onPress={() => setStoreItem(true)}
                style={styles.redecorate} 
                className="border-l-0 border-r-hairline"
                >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/storage_icon.png')}
                />                
                <Text style={styles.text}>Storage</Text>
            </Pressable>

            <Pressable 
                onPress={() => setOpenInventory(true)}
                style={styles.redecorate} 
                className="border-l-0 border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/place_item.png')}
                />                
                <Text style={[styles.text, { fontSize: 12} ]}>Inventory</Text>
            </Pressable>

            <Pressable  
                onPress={saveEditing} 
                style={styles.redecorate}
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
};

const styles = StyleSheet.create({
    buttonstyle: {
        width: 65,
        height: 65,
        backgroundColor: '#EEDBD3',
        borderWidth: 2,
        borderColor: '#472A2A',
    },
    redecorate: {
        width: 60,
        height: 60,
        backgroundColor: '#EEDBD3',
        borderWidth: 2,
        borderColor: '#472A2A',
    },
    done: {
        width: 150,
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

