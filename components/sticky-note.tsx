import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

type NoteProps = {
id?: number,
color: string,
text?: string,
top?: number,
left?: number,
}

export const StickyNote = ( { id, color, text, top, left }: NoteProps ) => {
    const [value, onChangeText] = useState('');

    return (
        <View className="relative w-full h-full items-center">
            <View className="absolute w-80 h-80 shadow-sm shadow-slate-700" style={{backgroundColor : color }}>
                <TextInput
                    placeholder="Your text here :)"
                    placeholderTextColor={'black'}
                    multiline
                    // numberOfLines={8}
                     // maxLength={100}
                    onChangeText={text => onChangeText(text)}
                    value={value}
                    style={styles.text}
                />
            </View>
                                
            <View className="absolute w-80 h-12" style={{backgroundColor : color, opacity: 0.3, mixBlendMode: 'multiply'}}>
            
            </View>
        </View>

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