import { DragNote } from '@/components/DragNote';
import Inventory from '@/components/inventory';
import LowerNav from '@/components/lowerNav';
import { useNotes } from '@/components/NoteContext';
import RedecorateBar from '@/components/redecorate-bar';
import { useStickers } from '@/components/StickerContext';
import { StickyNote } from '@/components/sticky-note';
import TransformBar from '@/components/transform-toolbar';
import { useRoomEditor } from '@/hooks/use-room-editor';
import { auth, db } from '@/src/firebase/config';
import { Asset } from 'expo-asset';
import { Stack, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ViewShot from 'react-native-view-shot';
import monstera from '../assets/images/desk/Desk-monstera.png';
import info from '../assets/images/info.png';
import { NavButton } from '../components/buttons/navButtons';
import { DragItem } from '../components/drag-items';
import JournalModal from '../components/JournalModal';
import { Sidebar } from './Sidebar';

const DeskScreen = ({ onSnapshotUpdate }) => {
    const router = useRouter();
    const [journalVisible, setJournalVisible] = useState(false);
    const [gems, setGems] = useState(0);
    const [isVisible, setIsVisible] = React.useState(false);

    const {
      isEditing, editingItems, setEditingItems,
      selectedItem, setSelectedItem,
      openInventory, setOpenInventory,
      roomItems, viewShotRef, displayItems,
      startEditing, cancelEditing, saveEditing,
      rotateItem, bringForward, pushBack,
      storeItem, handlePlaceItem, stopDrag,
    } = useRoomEditor(
    {
      plant: { image: monstera, x: 0, y: 400, z:2, scaleX: 1},
      wallItem: {image: null, x: 150, y: 350, z:1, scaleX: 1},
      wallpaper: {image: null, x: 150, y: 350, z:1, scaleX: 1},
      deskItem: {}
    },
    'Desk_snapshot',
    'deskItem'
  );

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
    <ViewShot
        ref={viewShotRef}
        style={{ flex: 1 }}
        options={{ format: "jpg", quality: 0.9 }}
    >
    <Sidebar gems={gems}>

        {!isEditing}
        
        {/* WALLPAPER */}
        <View className="flex-1">
            <View className="flex-1 bg-light-pink">
                {displayItems.wallpaper.image ? (
                    <Image 
                        source={displayItems.wallpaper.image} 
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    resizeMode="cover" />
                ) : (
                    <View className="flex-1 bg-light-pink"/>
                )}
                {isEditing && displayItems.wallpaper.image && (
                    <Pressable 
                        onPress={() => setSelectedItem('wallpaper')}
                    />
                )}
            </View>
            

        <Stack.Screen options={{ headerShown: false, contentStyle: { paddingTop: 0, marginTop: 0 }  }} />

        {/* Bulletin Board */}
        <View className="absolute top-64 right-3 w-72 h-48 bg-bulletin-board border-8 border-bulletin-border z-[1]" >
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

    {/* WALL ITEM */}
    {displayItems.wallItem.image && (
        <DragItem
        item={{ 
            id: 'wallItem', 
            x: displayItems.wallItem.x, 
            y: displayItems.wallItem.y, 
            z: displayItems.wallItem.z,
            scaleX: displayItems.wallItem.scaleX ?? 1,
        }}
        draggable={isEditing}
        selected={isEditing && selectedItem === 'wallItem'}
        onPress={() => setSelectedItem('wallItem')}
        stopDrag={(id, x, y) => {
            if (isEditing) {
            setEditingItems(prev => ({
                ...prev,
                [id]: { ...prev[id], x, y }
            }));
            }
        }}
        >
        <Image source={displayItems.wallItem.image} style={{width: 110, height:110}} contentFit="contain" />
        </DragItem>
    )}
        {/* PLANT */}
        <DragItem
        item={{ 
            id: 'plant', 
            x: displayItems.plant.x, 
            y: displayItems.plant.y, 
            z: displayItems.plant.z ,
            scaleX: displayItems.plant.scaleX ?? 1,
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

      {/* This maps the items that can have multiple of that type placed */}
      {displayItems.deskItem &&
        Object.values(displayItems.deskItem).map(item => (
          <DragItem
            key={item.id}
            item={item}
            draggable={isEditing}
            selected={selectedItem === item.id}
            onPress={() => setSelectedItem(item.id)}
            stopDrag={(id, x, y) => {
              setEditingItems(prev => ({
                ...prev,
                deskItem: {
                  ...prev.deskItem,
                  [id]: {
                    ...prev.deskItem[id],
                    x,
                    y,
                  }
                }
              }));
            }}
          >
            <Image source={item.image} style={{ width: item.width, height: item.height }} contentFit="contain"/>
          </DragItem>
        ))
      }
        {/* Header */}
        {!isEditing && (
        <>
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
            </>
        )}
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
        {!isEditing && (
        <>
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
        {/*<View className="absolute -bottom-20 -right-24 w-full">
            <ImgButton
            screenName="/shop" //file name that links to shop
            imgSource={require('../figma-icons/shop_btn.png')}
            text="Shop"
            textStyle="absolute bottom-[80px] right-24 font-bold text-brown text-center"
            imgStyle="w-64 h-64"
            resizeMode="contain"
            />
        </View>*/}
    
        { /* 'Redecorate' Button */ }
        { /*<View className="absolute bottom-44 right-[150px]">
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
            </Pressable>*/}


            {/* <NavButton 
            text="Redecorate" 
            screenName="/"      //file name for redecorating
            btnStyle="absolute bg-light-pink w-48 h-48 rounded-full z-50"
            textStyle=""
            innerCircle="absolute bg-peach w-44 h-44"
            /> 
        </View>*/}
        </>
        )}
      {/* REDECORATE INSTRUCTIONS BOX */}
      {isEditing && (
        <View style={{width: '70%', height: 50, backgroundColor:'#EEDBD3', alignSelf: 'center'}}
            className="absolute top-24">
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <Image source={info} style={{ width: 24, height:24, marginLeft:10}}/>
            <Text style={{ marginLeft:8 }}>Tap on an item to change its style.</Text>
          </View>
        </View>
      )}        
        {/* INVENTORY OVERLAY */}
        {isEditing && openInventory && (
            <Inventory
                setOpenInventory={setOpenInventory} 
                onPlaceItem={handlePlaceItem} 
                currentRoom="Desk"
            />
        )}
        {/* TRANSFORM BAR OVERLAY */}
        {isEditing && selectedItem && (
            <TransformBar 
                rotateItem={rotateItem}
                bringForward={bringForward} 
                pushBack={pushBack} 
                storeItem={storeItem}
                selectedItem={selectedItem} 
            />
        )}
        { isEditing ? (
            <RedecorateBar 
                setOpenInventory={setOpenInventory} 
                bringForward={bringForward} 
                pushBack={pushBack} 
                setStoreItem={storeItem}
                saveEditing={saveEditing} 
                cancelEditing={cancelEditing}/>
            ) : (
                <LowerNav startEditing={startEditing} />
            )}
        </View>
    <JournalModal
    visible={journalVisible}
    onClose={() => setJournalVisible(false)}
    />
    </Sidebar>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
    plant: {
        width: 200,
        height: 200,
    }
});

export default DeskScreen;