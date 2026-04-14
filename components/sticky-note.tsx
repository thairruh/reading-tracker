import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, Pressable, StyleSheet, TextInput, StyleProp, ViewStyle } from 'react-native';

type NoteProps = {
id?: number,
color: string,
text?: string,
top?: number,
left?: number,
variant?: 'large' | 'small' | 'mini',
style?: StyleProp<ViewStyle>;
isEditable?: boolean,
changeText?: (value: string) => void; 
}

export const StickyNote = ( { id, color, text, top, left, variant='large', isEditable=true, changeText}: NoteProps ) => {
    const [value, setValue] = useState('');
    // const size = variant == 'small' ? 'w-40 h-40' : 'w-80 h-80';
    // const shadingSize = variant == 'small' ? 'w-40 h-8' : 'w-80 h-12';
    const scale = variant === 'small' ? 0.3 : 1;
    const size = variant === 'mini' ? 32 : variant === 'small' ? 64 : 320;
    const shadingSize = variant === 'mini' ? 5 : variant === 'small' ? 10 : 48;
    const fontSize = variant === 'mini' ? 4 : variant === 'small' ? 8 : 20;

    return (
        <View className="relative w-full h-full items-center">
            <View 
                pointerEvents={isEditable? 'auto' : 'none'} //don't allow text input if note isn't editable
                className={"shadow-sm shadow-slate-700"} 
                style={{width: size, height: size, backgroundColor : color }}
            >
                <TextInput
                    editable={isEditable}
                    placeholder="Your text here :)"
                    placeholderTextColor={'black'}
                    multiline
                    // numberOfLines={8}
                    // maxLength={100}
                    value={text}
                    onChangeText={changeText}
                    style={[styles.text, {fontSize: fontSize, marginTop: shadingSize}]}
                />
                
                 <View 
                    className={"absolute w-full"} 
                    style={{height: shadingSize, backgroundColor : color, opacity: 0.3, mixBlendMode: 'multiply' }}
                 />
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
        flex: 1,
        color: 'black',
        fontFamily: 'Verdana',
        fontSize: 20,
        padding: 5,
        marginTop: 45,
        marginLeft: 2,
    },
})