import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View, Image, Text, StyleSheet, TouchableOpacity, } from "react-native";
import EditBar from '../components/bulletin-edit-bar';

export default function Bulletin() {
    const navigation = useRouter();
    const [isVisible, setIsVisible] = React.useState(false);

    const closeEditBar = () => {
        setIsVisible(false);
    };

  return (
    
    <View className="flex-1 relative bg-light-pink">
      
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
        <View className="absolute top-1/3 w-full h-full">
            <Pressable
            onPress={() => setIsVisible(true)}
            >
                <View className="w-full h-72 bg-bulletin-board border-[10px] border-bulletin-border" />

            </Pressable>
            
             {/* Make Edit Bar visible when bulletin is pressed */}
            {isVisible && (
                <View className="flex-row absolute bottom-72 ml-10 w-full h-full">
                    <EditBar/>

                    {/* If Edit Bar is currently visible & 'Done' is pressed, hide edit bar */}
                    <EditBar donePressed={closeEditBar}/>
                </View>
            )}
        </View>
    </View>

  );
};