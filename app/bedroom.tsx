import { Image, ImageBackground } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import squareRug from '../assets/images/bedroom/Bedroom-circle-rug.png';
import flowerPhoto from '../assets/images/bedroom/Bedroom-flower-photo.png';
import blueFrillyBed from '../assets/images/bedroom/Bedroom-frilly-bed-blue.png';
import bookshelf from '../assets/images/bedroom/BR-bookshelf-plain.png';
import whiteShelf from '../assets/images/bedroom/br-bookshelf-white.png';
import pinkCheckerBed from '../assets/images/bedroom/Br-checker-bed-pink.png';
import floor from '../assets/images/bedroom/BR-floor-wood-light.png';
import plainBed from '../assets/images/bedroom/Br-plain-bed.png';
import plainTable from '../assets/images/bedroom/br-plain-table.png';
import flowerRug from '../assets/images/bedroom/BR-square-rug-lightblue .png';
import info from '../assets/images/info.png';
import overlay from '../assets/images/Redecorate-overlay.png';
import DragItem from '../components/drag-items';
import CustomHeader from '../components/header';
import LowerNav from '../components/lowerNav';
import RedecorateBar from '../components/redecorate-bar';

const Bedroom = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItems, setEditingItems] = useState(null);

  const [roomItems, setRoomItems] = useState({
    bed: { image: plainBed, x: 50, y: 400},
    bookshelf: {image: bookshelf, x: 150, y: 300},
    rug: null,
    table: null,
    wallItem1: null,
    wallItem2: null,
    wallpaper: null,
    floor: floor,
  });

  const [inventory, setInventory] = useState({
    bed: [pinkCheckerBed, blueFrillyBed],
    bookshelf: [whiteShelf],
    rug: [flowerRug, squareRug],
    table: [plainTable],
    wallItem: [flowerPhoto]
  });

  const startEditing = () => {
    setEditingItems(roomItems);
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
    
  const cancelEditing = () => {
    setEditingItems(null);
    setIsEditing(false);
  };

  const saveEditing = () => {
    setRoomItems(editingItems);
    setEditingItems(null);
    setIsEditing(false);
  };

  const displayItems = isEditing ? editingItems : roomItems;


  return (
    <View style={styles.container}>

      {!isEditing && ( <CustomHeader />)}

      {/* REDECORATE INSTRUCTIONS BOX */}
      {isEditing && (
        <View style={{width: '70%', height: 50, backgroundColor:'#EEDBD3',alignSelf: 'center', marginTop: 100}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <Image source={info} style={{ width: 24, height:24, marginLeft:15}}/>
            <Text style={{ marginLeft:8 }}>Tap on an item to change its style</Text>
          </View>
        </View>
      )}
    
    {/* This makes the left wall darker, so it appears 3D*/}
    <View style={styles.wall}>
        <View style={styles.wallOverlay} />
    </View>


    <Pressable disabled={!isEditing} onPress={() => switchStyle('floor')}>
      <Image source={displayItems.floor} style={styles.floor} contentFit="contain"/>
    </Pressable>

    <DragItem
      item={{ id: 1, x: 50, y: 400 }}
      stopDrag={(id, x, y) => {
        setRoomItems(prev => ({
          ...prev,
          bedPosition: { x, y }
        }));
    }}>
      <Image source={displayItems.bed} style={styles.bed} contentFit="contain"/>
    </DragItem>
     
    
    {/*           LiBRARY SHELF
        (not clickable in redecorate mode) */}
    <View style={{ position: 'absolute', top: 340, left: 150 }}>
      <Link href="./library" asChild>
        <Pressable disabled={isEditing}>
          <Image source={bookshelf} style={styles.bookshelf}/>
        </Pressable>
      </Link>
    </View>
    

    { isEditing ? (
      <RedecorateBar saveEditing={saveEditing} cancelEditing={cancelEditing}/>
    ) : (
      <LowerNav startEditing={startEditing} />
    )}
    

    {/* Placeholder if there is no item of this kind placed
        this appears because a rug is not already placed  */}
    { isEditing && !displayItems.wallItem && ( 
      <View>
        <Pressable 
          style={[styles.editOverlay, {
            width: 70,
            height: 100,
            top: 250,
            left: 50,
            }]}> 
          <Text style={{fontSize:20, color:'white', marginLeft:180, top:150, transform: [{rotate: '-45deg'}]}}>photo</Text> 
        </Pressable> 
    
        <Pressable 
          style={[styles.editOverlay, {
            width: 70,
            height: 100,
            top: 150,
            right: 30,
            }]}> 
          <Text style={{fontSize:20, color:'white', marginLeft:180, top:150, transform: [{rotate: '-45deg'}]}}>photo</Text> 
        </Pressable> 
      </View>
    )}
    { isEditing && !displayItems.rug && ( 
        <Pressable style={{ position: 'absolute', top:450, left: 50}}> 
          <ImageBackground source={overlay} style={{width:300, height:300, opacity: 0.6}}>
            <Text style={{fontSize:20, color:'white', left:130, top:70, transform: [{rotate: '-55deg'}]}}>Rug</Text> 
          </ImageBackground>
        </Pressable> 
    )}
    { isEditing && !displayItems.table && ( 
        <Pressable style={{ position: 'absolute', top:480, left: -60}}> 
          <ImageBackground source={overlay} style={{width:150, height:150, opacity: 0.6}}>
            <Text style={{fontSize:20, color:'white', marginLeft:60, top:60, transform: [{rotate: '-45deg'}]}}>Table</Text> 
          </ImageBackground>
        </Pressable> 
    )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  wall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#d0d6c6',
    zIndex: -1,
  },
  wallOverlay: {
    width: 205,
    height: 700,
    position: 'absolute',
    right: 0,
    backgroundColor: '#929292',
    opacity: 0.3
  },
  floor: {
    position: 'absolute',
    top: 250,
    width: '100%',
    height: 620,
  },
  bed: {
    width: '70%',
    height: 300,
    position: 'absolute',
    top: 330,
    left: 0,
    zIndex: 1,
  },
  bookshelf: {
    width: 137,
    height: 252,
    
  },
  editOverlay: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    backgroundColor: 'black', 
    opacity: 0.2, 
    borderWidth: 2, 
    borderColor: '#aaa', 
    borderStyle: 'dashed', 
    justifyContent: 'center', 
    alignItems: 'center', }
});

export default Bedroom;