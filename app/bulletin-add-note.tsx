import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, Pressable, StyleSheet, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NoteEditBar } from '@/components/bulletin-edit-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StickyNote } from '@/components/sticky-note';
import { useNotes } from '@/components/NoteContext';
import { NoteData } from '@/components/NoteContext';

type ColorOptions = '#EFCB8C' | '#CAC1C6' | '#CCD4BF' | '#C7CFD1' | '#EFDBD4';


export default function AddNote() {
    const navigation = useNavigation();
    const [selectedColor, setSelectedColor] = useState<ColorOptions>('#EFCB8C');
    const [value, onChangeText] = useState('');
    const [notes, setNotes] = useState<NoteData[]>([]);

    const colors: ColorOptions[] = ['#EFCB8C', '#CAC1C6', '#CCD4BF', '#C7CFD1','#EFDBD4'];
                                 //[ yellow,    purple,     green,      blue,     pink ]

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                    <StickyNote color={selectedColor}/>
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
                     <NoteEditBar text={value} color={selectedColor}/>
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