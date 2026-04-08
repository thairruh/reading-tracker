import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable, View, Image } from "react-native";
// import { ImgButton } from '../components/buttons/navButtons';

export default function Bulletin() {
    const navigation = useNavigation();
  return (
    
    <View className="flex-1 relative bg-light-pink">
      
        <Pressable
        onPress={() => navigation.goBack()}
        className="absolute top-16 left-5 "
        >
            <Image 
                source={require('../figma-icons/arrow-left-circle.png') }
                className="w-16 h-16"
            />
        </Pressable>

        {/* Bulletin Board */}
        <View className="absolute top-1/2 -mt-36 w-full h-72 bg-bulletin-board border-4 border-bulletin-border" />
    
    </View>

  );
}
