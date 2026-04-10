import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, ImageProps, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

type NavButtonProps = {
    text: string;
    screenName: string;
    btnStyle?: string;
    textStyle?: string;
    innerCircle?: string;
}

type ImgButtonProps = {
    screenName?: string;
    imgSource: ImageSourcePropType;
    text?: string;
    textStyle?: string;
    imgStyle?: string;
    resizeMode?: ImageProps['resizeMode'];
}

export const NavButton = ({ text, screenName, btnStyle, textStyle, innerCircle }: NavButtonProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity onPress ={() => router.navigate(screenName as any)}>
            <View className={`flex items-center justify-center border-2 border-btn-border ${btnStyle}`}>
                <View className={`rounded-full ${innerCircle}`}/>
                <Text className={`font-bold text-brown ${textStyle}`}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const ImgButton = ({ screenName, imgSource, text, textStyle, imgStyle, resizeMode="cover" }: ImgButtonProps) => {
    const router = useRouter();
    return (
        <TouchableOpacity onPress ={() => router.navigate(screenName as any)}>
            <View>
                <ImageBackground source={imgSource} className={`${imgStyle}`} resizeMode={resizeMode}>
                    <Text className={`font-bold text-brown text-center ${textStyle}`}>{text}</Text>
                </ImageBackground>
            </View>
            
        </TouchableOpacity>
    );
};