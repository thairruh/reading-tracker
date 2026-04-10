import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

type ColorOptions = '#EFCB8C' | '#CAC1C6' | '#CCD4BF' | '#C7CFD1' | '#EFDBD4';

export default function AddNote() {
    const navigation = useNavigation();
    const [selectedColor, setSelectedColor] = useState<ColorOptions>('#EFCB8C');

    const colors: ColorOptions[] = ['#EFCB8C', '#CAC1C6', '#CCD4BF', '#C7CFD1','#EFDBD4'];
                                 //[ yellow,    purple,     green,      blue,     pink ]
    return (
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
                
                <View className="absolute w-80 h-80 shadow-sm shadow-slate-700" style={{backgroundColor : selectedColor }}/>
                <View className="absolute w-80 h-12" style={{backgroundColor : selectedColor, opacity: 0.3, mixBlendMode: 'multiply'}}/>
            </View>

            {/* Buttons to change note color */}
            <View className="flex-row absolute bottom-80 left-10 w-full">
            {colors.map((color) => {
                const isSelected = selectedColor  === color;

                return (
                    <Pressable
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        className={`m-1 w-16 h-16 rounded-full border-2 ${isSelected ?  'border-black' : 'border-transparent'}`}

                        style={{ backgroundColor: color }}
                    />
                );
            })}
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

    },
})