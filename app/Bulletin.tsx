import React from 'react';
import { View } from "react-native";
import { ImgButton } from '../components/buttons/navButtons';

export default function Bulletin() {
  return (
    
    <View className="flex-1 relative bg-light-pink">
      
        <ImgButton
        screenName="/DeskScreen" 
        imgSource={require('../figma-icons/arrow-left-circle.png')}
        imgStyle="absolute top-16 left-5 w-16 h-16 "
        resizeMode='contain'
        />  

        {/* Bulletin Board */}
        <View className="absolute top-1/2 -mt-36 w-full h-72 bg-bulletin-board border-4 border-bulletin-border" />
    
    </View>

  );
}
