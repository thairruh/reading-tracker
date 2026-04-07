import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import { ImgButton, NavButton } from '../components/buttons/navButtons';
import { Sidebar } from './Sidebar';

export default function DeskScreen() {
    const router = useRouter();
  return (
    <Sidebar>
    <View className="flex-1 items-center justify-center bg-light-pink">

        <Stack.Screen options={{ headerShown: false, contentStyle: { paddingTop: 0, marginTop: 0 }  }} />

        {/* Bulletin Board */}
        <View className="absolute top-64 right-3 w-72 h-48 bg-bulletin-board border-8 border-bulletin-border" >
            <TouchableOpacity 
                className="flex-1 justify-center items-center"
                onPress ={() => router.push('./Bulletin')}>

            </TouchableOpacity>
        </View>

        {/* Desk */}
        <View className="absolute bottom-0 w-full h-80 bg-pink border-t-2 border-desk-shading/50" />
        {/* Under desk shading */}
        <View className="absolute bottom-0 w-full h-32 bg-desk-shading z-0" />
        {/* Underdesk */}
        <View className="absolute bottom-0 w-full h-20 bg-under-desk z-0" />

        {/* Header */}
        <Image
        source={require('../figma-icons/header-lg.png')}
        className="absolute w-full"
        style={{ top: -40, height: 200 }}
        resizeMode='contain'
        />

        {/* Star Box */}
            <View className="absolute top-14 left-48">
                <Image
                source={require('../figma-icons/star_Box.png')}
                className="w-20"
                resizeMode='contain'
                />
            </View>

        {/* Gem Box */}
            <View className="absolute top-[45px] right-20">
                <Image
                source={require('../figma-icons/gem_Box.png')}
                className="w-[82px]"
                resizeMode='contain'
                />
            </View> 

        {/* Journal on desk */}
        <View className="absolute bottom-12">
            <ImgButton
            screenName="/" //file name that links to shop
            imgSource={require('../figma-icons/desk-journal.png')}
            text=""
            textStyle=""
            imgStyle="w-72 h-72"
            resizeMode="cover"
            />
        </View>


        {/* Navigation Buttons */}
        { /* 'Profile' Button */ }
        <View className="absolute top-6 left-[85px] w-24 h-24 items-center justify-center">
            <NavButton 
            text="Profile" 
            screenName="/"  //file name linking to profile screen
            btnStyle="bg-peach w-24 h-24 rounded-full"
            textStyle="ml-6 text-sm text-center"
            innerCircle="absolute bg-light-pink w-20 h-20"
            />
        </View>

        { /* 'Change Area' Button */ }
        <View className="absolute top-6 -left-12 items-start">
            <NavButton 
            text="Change Area" 
            screenName=""  //file name linking to change area screen
            btnStyle="bg-peach w-48 h-48 rounded-full"
            textStyle="ml-6 text-lg w-20"
            innerCircle="absolute bg-light-pink w-44 h-44"
            />
        </View>

        
        { /* 'Shop' Button */ }
        <View className="absolute -bottom-20 -right-24 w-full">
            <ImgButton
            screenName="/" //file name that links to shop
            imgSource={require('../figma-icons/shop_btn.png')}
            text="Shop"
            textStyle="absolute bottom-[80px] right-24 font-bold text-brown text-center"
            imgStyle="w-64 h-64"
            resizeMode="contain"
            />
        </View>

        { /* 'Redecorate' Button */ }
        <View className="absolute bottom-44 right-[150px]">
            <NavButton 
            text="Redecorate" 
            screenName="/"      //file name for redecorating
            btnStyle="absolute bg-light-pink w-48 h-48 rounded-full z-50"
            textStyle=""
            innerCircle="absolute bg-peach w-44 h-44"
            />
        </View>

    </View>
    </Sidebar>
  );
};
