import { Stack, useRouter } from 'expo-router';
import React, { use, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, Text, Pressable } from "react-native";
import { ImgButton, NavButton } from '../components/buttons/navButtons';
import { Sidebar } from './Sidebar';
import JournalModal from '../components/JournalModal';
import { Asset } from 'expo-asset';
import { auth, db } from '@/src/firebase/config';
import { getUserDocument } from '@/src/firebase/users';
import { doc, onSnapshot } from 'firebase/firestore';
import { RedecorateEditBar } from '@/components/bulletin-edit-bar';
import { StickyNote } from '@/components/sticky-note';
import { useNotes } from '@/components/NoteContext';
import { DragNote } from '@/components/DragNote';

export default function DeskScreen() {
    const router = useRouter();
    const [journalVisible, setJournalVisible] = useState(false);
    const [gems, setGems] = useState(0);
    const [isVisible, setIsVisible] = React.useState(false);

    // load journal image into cache for smoother performance when opening journal modal
    useEffect(() => {
    Asset.loadAsync(require("../assets/images/Journal-export.png"));
    Asset.loadAsync(require("../assets/journal-tabs/entry-tab.png"));
    Asset.loadAsync(require("../assets/journal-tabs/past-tab.png"));
    Asset.loadAsync(require("../assets/journal-tabs/stickers-tab.png"));
    }, []);


    // fetch user data to get gems for display on deskscreen
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "users", user.uid);

        const unsubscribe = onSnapshot(ref, (snap) => {
            const data = snap.data();
            setGems(data?.gems ?? 0);
        });

        return unsubscribe;
    }, []);

       const closeEditBar = () => {
        setIsVisible(false);
    };
  const { notes, handleNotePosition } = useNotes();
  return (
    <Sidebar gems={gems}>
    
    <View className="flex-1 items-center justify-center bg-light-pink">

        <Stack.Screen options={{ headerShown: false, contentStyle: { paddingTop: 0, marginTop: 0 }  }} />

        {/* Bulletin Board */}
        <View className="absolute top-64 right-3 w-72 h-48 bg-bulletin-board border-8 border-bulletin-border" >
            <View className='absolute inset-0'>
            {notes.map((note) => {
                return (
                <DragNote
                key={note.id}
                note={note}
                isSelected={false}
                onPress={() => router.replace('/Bulletin')}
                stopDrag={handleNotePosition}
                >
                <StickyNote
                    isEditable={false}
                    key={note.id}
                    {...note}
                    variant='mini'
                />
                
                </DragNote>
                );
            })}
            </View>
            <Pressable 
                className="flex-1 justify-center items-center z-10"
                onPress ={() => router.replace('./Bulletin')}>
            </Pressable>
        </View>

        {/* Desk */}
        <View className="absolute bottom-0 w-full h-80 bg-[#FAECEC] border-t-2 border-desk-shading/50" />
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
                resizeMode="contain"
            />

            {/* Gems text */}
            <View className="absolute inset-y-0 right-2 items-center justify-center">
                <Text className="text-[12px] text-black">
                {gems}
                </Text>
            </View>
            </View>

        {/* Journal on desk */}
        <View className="absolute bottom-12">
        <TouchableOpacity onPress={() => setJournalVisible(true)}>
            <Image
            source={require('../figma-icons/desk-journal.png')}
            className="w-72 h-72"
            resizeMode="cover"
            />
        </TouchableOpacity>
        </View>


        {/* Navigation Buttons */}
        { /* 'Profile' Button */ }
        <View className="absolute top-6 left-[85px] w-24 h-24 items-center justify-center">
            <NavButton 
            text="Profile" 
            screenName="/profile"  //file name linking to profile screen
            btnStyle="bg-peach w-24 h-24 rounded-full"
            textStyle="ml-6 text-sm text-center"
            innerCircle="absolute bg-light-pink w-20 h-20"
            />
        </View>

        { /* 'Change Area' Button */ }
        <View className="absolute top-6 -left-12 items-start">
            <NavButton 
            text="Change Area" 
            screenName="/change-room"  //file name linking to change area screen
            btnStyle="bg-peach w-48 h-48 rounded-full"
            textStyle="ml-6 text-lg w-20"
            innerCircle="absolute bg-light-pink w-44 h-44"
            />
        </View>

        
        { /* 'Shop' Button */ }
        <View className="absolute -bottom-20 -right-24 w-full">
            <ImgButton
            screenName="/shop" //file name that links to shop
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
    <JournalModal
    visible={journalVisible}
    onClose={() => setJournalVisible(false)}
    />
    </Sidebar>
  );
};
