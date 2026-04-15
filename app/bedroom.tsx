import Inventory from '@/components/inventory';
import { Image } from 'expo-image';
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
import { DragItem } from '../components/drag-items';
import CustomHeader from '../components/header';
import LowerNav from '../components/lowerNav';
import RedecorateBar from '../components/redecorate-bar';

const Bedroom = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItems, setEditingItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openInventory, setOpenInventory] = useState(false);
  const [storeItem, setStoreItem] = useState(null);
  

  const [roomItems, setRoomItems] = useState({
    bed: { image: plainBed, x: 0, y: 500, z:2},
    bookshelf: {image: bookshelf, x: 150, y: 350, z:1},
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
  setEditingItems(JSON.parse(JSON.stringify(roomItems)));
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
    setEditingItems(roomItems);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const saveEditing = () => {
    setRoomItems(editingItems);
    setEditingItems(null);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const displayItems = isEditing && editingItems ? editingItems : roomItems;


  return (
    <View style={styles.container}>

      {!isEditing && ( <CustomHeader />)}

      {/* REDECORATE INSTRUCTIONS BOX */}
      {isEditing && (
        <View style={{width: '70%', height: 50, backgroundColor:'#EEDBD3',alignSelf: 'center', marginTop: 100}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <Image source={info} style={{ width: 24, height:24, marginLeft:15}}/>
            <Text style={{ marginLeft:8 }}>Tap on an item to change its style.</Text>
          </View>
        </View>
      )}
    
    {/* This makes the left wall darker, so it appears 3D*/}
    <View style={styles.wall}>
        <View style={styles.wallOverlay} />
    </View>


    <Pressable 
      disabled={!isEditing} 
      onPress={() => switchStyle('floor')} 
      pointerEvents="box-none"
    >
      <Image source={displayItems.floor} style={styles.floor} contentFit="contain"/>
    </Pressable>

    {/* BED */}
    <DragItem
      item={{ 
        id: 'bed', 
        x: displayItems.bed.x, 
        y: displayItems.bed.y, 
        z: displayItems.bed.z 
      }}
      draggable={isEditing}
      selected={isEditing && selectedItem === 'bed'}
      onPress={() => setSelectedItem('bed')}
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
          source={displayItems.bed.image}
          style={styles.bed} 
          contentFit="contain"
      />
    </DragItem>
    
    {/*           LiBRARY SHELF
        (not clickable in redecorate mode) */}

    <DragItem
      item={{ 
        id: 'bookshelf', 
        x: displayItems.bookshelf.x, 
        y: displayItems.bookshelf.y, 
        z: displayItems.bookshelf.z 
      }}
      draggable={isEditing}
      selected={isEditing && selectedItem === 'bookshelf'}
      onPress={() => setSelectedItem('bookshelf')}
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
      <View>
        <Link href="./library" asChild>
          <Pressable disabled={isEditing}>
            <Image source={displayItems.bookshelf.image} style={styles.bookshelf}/>
          </Pressable>
        </Link>
    </View>
    </DragItem>

    {/* INVENTORY OVERLAY */}
    {isEditing && openInventory && (
      <Inventory 
        setOpenInventory={setOpenInventory} 
        onPlaceItem={handlePlaceItem} 
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
    width: 300,
    height: 300,
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