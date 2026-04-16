import { Stack, useRouter } from 'expo-router';
import React, { use, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, Text, Pressable, StyleSheet } from "react-native";
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
import { useStickers } from '@/components/StickerContext';
import { DragItem } from '../components/drag-items';
import DeskInventory from '@/components/desk-inventory';
import monstera from '../assets/images/desk/Desk-monstera.png';
import aglaonema from '../assets/images/desk/desk-plant-aglaonema.png';
import peacelily from '../assets/images/desk/desk-plant-peacelily .png';
import wallphotos from '../assets/images/desk/Desk-wall-photos.png';
import wallpaper1 from '../assets/images/desk/Desk-wallpaper-1.png';
import flowerlamp from '../assets/images/desk/Desk-flower-lamp.png';
import info from '../assets/images/info.png';

export default function DeskScreen() {
    const router = useRouter();
    const [journalVisible, setJournalVisible] = useState(false);
    const [gems, setGems] = useState(0);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItems, setEditingItems] = useState(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [openInventory, setOpenInventory] = useState(false);
    const [storeItem, setStoreItem] = useState(null);

  const [deskItems, setdeskItems] = useState({
    plant: { image: monstera, x: 0, y: 400, z:2},
    deskItem: null,
    wallItem: {image: wallphotos, x: 150, y: 350, z:1},
    wallpaper: null,
  });

  const [inventory, setInventory] = useState({
    plant: [aglaonema, peacelily],
    deskItem: [flowerlamp],
    wallItem: [wallphotos],
    wallpaper: [wallpaper1],
  });

 const startEditing = () => {
  setEditingItems(JSON.parse(JSON.stringify(deskItems)));
  setIsEditing(true);
};

  const switchStyle = (type) => {
    if (!editingItems) return;

    const options = inventory[type];
    const currentItem = editingItems[type];

    const currentIndex = options.indexOf(currentItem);
    const nextIndex = (currentIndex + 1) % options.length;

    setEditingItems(prev => ({
      ...prev,
      [type]: options[nextIndex],
    }));
  };

// Lets the player increase the z index of selected item 
const bringForward = () => {
  if (!selectedItem || !editingItems) return;

  const maxZ = Math.max(
    ...Object.values(editingItems).map(item => item?.z ?? 0)
  );

  setEditingItems(prev => ({
    ...prev,
    [selectedItem]: {
      ...prev[selectedItem],
      z: maxZ + 1,
    }
  }));
};

// Lets the player decrease the z index of selected item 
const pushBack = () => {
  if (!selectedItem || !editingItems) return;

  const maxZ = Math.max(
    ...Object.values(editingItems).map(item => item?.z ?? 0)
  );

  setEditingItems(prev => ({
    ...prev,
    [selectedItem]: {
      ...prev[selectedItem],
      z: maxZ - 1,
    }
  }));
};

// if an item of that style (e.g. bed) is already placeed,
// swap the image to change style
const handlePlaceItem = (newItem) => {
    const type = newItem.tag.toLowerCase();
    
    setEditingItems(prev => ({
        ...prev,
        [type]: {
            ...prev[type], // Keep existing x, y, z
            image: newItem.image // Swap the image
        }
    }));
};

    
  const cancelEditing = () => {
    setEditingItems(deskItems);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const saveEditing = () => {
    setdeskItems(editingItems);
    setEditingItems(null);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const displayItems = isEditing && editingItems ? editingItems : deskItems;

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
  const { stickers, handleStickerPosition } = useStickers();
  return (
    <Sidebar gems={gems}>
    
    <View className="flex-1 bg-light-pink">

        {!isEditing}

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
            
        { /* Display stickers on desk bulletin*/ }
        {stickers.map((sticker) => {
            return (
                <DragNote
                    key={sticker.id}
                    note={sticker}
                    isSelected={false}
                    onPress={() => router.replace('/Bulletin')}
                    stopDrag={handleStickerPosition}
                >
                    <View
                        key={sticker.id}
                        style={{
                        //position: 'absolute',
                        top: sticker.top,
                        left: sticker.left,
                        zIndex: 20,
                    }}>
                        <Image 
                        source={sticker.image}
                        style={{
                        width: 32,
                        height: 32,
                        }}/>
                    </View>
                </DragNote>
            );
        })}            
            </View>
            <Pressable 
                disabled={isEditing}
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

        {/* PLANT */}
        <DragItem
        item={{ 
            id: 'plant', 
            x: displayItems.plant.x, 
            y: displayItems.plant.y, 
            z: displayItems.plant.z 
        }}
        draggable={isEditing}
        selected={isEditing && selectedItem === 'plant'}
        onPress={() => setSelectedItem('plant')}
        stopDrag={(id, x, y) => {
        if (isEditing) {
            setEditingItems(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                x,
                y
            }
            }));
        }
        }}
        >
            <Image 
            source={displayItems.plant.image}
            style={styles.plant} 
            resizeMode="contain"
        />
        </DragItem>        
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
        <View className="absolute left-20 bottom-12">
        <TouchableOpacity 
            disabled={isEditing}
            onPress={() => setJournalVisible(true)}>
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
            <Pressable
                onPress={() => {
                    setIsEditing(true);
                    startEditing
                    setIsVisible(false);
            }}>
            <View className={"flex items-center justify-center border-2 border-btn-border absolute bg-light-pink w-48 h-48 rounded-full z-50"}>
                <View className={"rounded-full absolute bg-peach w-44 h-44"}/>
                <Text className={"font-bold text-brown "}>Redecorate</Text>
            </View>
            </Pressable>

            {/* <NavButton 
            text="Redecorate" 
            screenName="/"      //file name for redecorating
            btnStyle="absolute bg-light-pink w-48 h-48 rounded-full z-50"
            textStyle=""
            innerCircle="absolute bg-peach w-44 h-44"
            /> */}
        </View>
      {/* REDECORATE INSTRUCTIONS BOX */}
      {isEditing && (
        <View style={{width: '70%', height: 50, backgroundColor:'#EEDBD3', alignSelf: 'center'}}
            className="absolute top-28">
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <Image source={info} style={{ width: 24, height:24, marginLeft:10}}/>
            <Text style={{ marginLeft:8 }}>Tap on an item to change its style.</Text>
          </View>
        </View>
      )}        
        {/* INVENTORY OVERLAY */}
        {isEditing && openInventory && (
            <DeskInventory
                setIsEditing={setIsEditing}
                setOpenInventory={setOpenInventory} 
                onPlaceItem={handlePlaceItem} 
            />
        )}
        { isEditing && (
            <View className="flex-row absolute bottom-0 ml-9 w-full h-full">
                <RedecorateEditBar 
                    cancelEditing={cancelEditing}
                    pushBack={pushBack}
                    bringForward={bringForward}
                    setStoreItem={storeItem}
                    setOpenInventory={setOpenInventory}
                    saveEditing={saveEditing}
                    />
            </View>
        )}
    </View>
    <JournalModal
    visible={journalVisible}
    onClose={() => setJournalVisible(false)}
    />
    </Sidebar>
  );
};

const styles = StyleSheet.create({
    plant: {
        width: 200,
        height: 200,
    }
});