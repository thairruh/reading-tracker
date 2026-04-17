import Inventory from '@/components/inventory';
import TransformBar from '@/components/transform-toolbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import bookshelf from '../assets/images/bedroom/BR-bookshelf-plain.png';
import floor from '../assets/images/bedroom/BR-floor-wood-light.png';
import plainBed from '../assets/images/bedroom/Br-plain-bed.png';
import info from '../assets/images/info.png';
import { DragItem } from '../components/drag-items';
import CustomHeader from '../components/header';
import LowerNav from '../components/lowerNav';
import RedecorateBar from '../components/redecorate-bar';

const Bedroom = ({ onSnapshotUpdate}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItems, setEditingItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openInventory, setOpenInventory] = useState(false);
  

  // This is for items that can only have one of its type on the screen
  const [roomItems, setRoomItems] = useState({
    bed: { image: plainBed, x: 0, y: 500, z:2, scaleX: 1},
    bookshelf: {image: bookshelf, x: 150, y: 350, z:1, scaleX: 1},
    rug: {image: null, x: 150, y: 450, z:1, scaleX: 1},
    table: {image: null, x: 250, y: 450, z:1, scaleX: 1},
    wallpaper: {image: null, x: 150, y: 350, z:1, scaleX: 1},
    floor: floor,
    wallItems: {}
  });

  useEffect(() => {
    const loadBedroomItems = async () => {
      try {
        const saved = await AsyncStorage.getItem('bedroom_items');
        if (saved) {
          setRoomItems(JSON.parse(saved));
        }
      } catch (error) {
        console.log('Failed to load bedroom items', error);
      }
    };

    loadBedroomItems();
  }, []);


 const startEditing = () => {
  setEditingItems({ ...roomItems });
  setIsEditing(true);
};

//--- TRANSFORMATION TOOLBAR ACTIONS ---//

const rotateItem = () => {
  if (!selectedItem || !editingItems) return;

  setEditingItems(prev => {
    
    if (prev.wallItems?.[selectedItem]) {
      const current = prev.wallItems[selectedItem];
      const currentScale = current.scaleX ?? 1;

      return {
        ...prev,
        wallItems: {
          ...prev.wallItems,
          [selectedItem]: {
            ...current,
            scaleX: current.scaleX === -1 ? 1 : -1,
          }
        }
      };
    }
    
    const current = prev[selectedItem];
    const currentScale = current.scaleX ?? 1;
    if (!current) return prev;


    return {
      ...prev,
      [selectedItem]: {
        ...current,
        scaleX: currentScale === -1 ? 1 : -1,
      },
    };
  });
};

// prevents onPress from resetting state when 
// reselecting an item
const onPress = () => {
  if (selectedItem !== item.id) {
    setSelectedItem(item.id);
  }
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

const storeItem = () => {
  if (!selectedItem || !editingItems) return;

  if (editingItems.wallItems?.[selectedItem]) {
    setEditingItems(prev => {
      const updatedWallItems = { ...prev.wallItems };
      delete updatedWallItems[selectedItem];
      return { ...prev, wallItems: updatedWallItems };
    });
    } else {
    setEditingItems(prev => ({
      ...prev,
      [selectedItem]: {
        ...prev[selectedItem],
        image: null,
      }
    }));
    setSelectedItem(null);
  }
};

//--- MAIN REDECORATE TOOLBAR ACTIONS ---//

const handlePlaceItem = (newItem) => {
    const type = newItem.tag.toLowerCase();
    
    // items with the "wall-item" tag can have multiple items
    // of that type added to the screen. wall-items can be replaced
    // with desk-items for the desk screen
    if (type === "wall-item") {
      const id = `wall-${Date.now()}`;

    setEditingItems(prev => {
      const maxZ = Math.max(
        0,
        ...Object.values(prev.wallItems || {}).map(i => i?.z ?? 0)
      );

      return {
        ...prev,
        wallItems: {
          ...prev.wallItems,
          [id]: {
            id,
            image: newItem.image,
            x: 100,
            y: 300,
            z: 1,
            scaleX: 1,
          }
        }
      };
    });

// if an item of that style (e.g. bed) is already placeed,
// swap the image to change style
  } else {
    setEditingItems(prev => ({
        ...prev,
        [type]: {
            ...prev[type], // Keep existing x, y, z
            image: newItem.image // Swap the image
        }
    }));
  }
    setOpenInventory(false)
};

  const cancelEditing = () => {
    setEditingItems(roomItems);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const viewShotRef = useRef();

  const saveEditing = async () => {
    if (!editingItems) return;

    setRoomItems(editingItems);
    setEditingItems(null);
    setIsEditing(false);
    setSelectedItem(null);

    try {
      await AsyncStorage.setItem('bedroom_items', JSON.stringify(editingItems));
    } catch (error) {
      console.log('Failed to save bedroom items', error);
    }

    setTimeout(async () => {
      try {
        const uri = await captureRef(viewShotRef, {
          format: 'jpg',
          quality: 0.7,
        });
        await AsyncStorage.setItem('bedroom_snapshot', uri);
      } catch (error) {
        console.log('Bedroom snapshot failed', error);
      }
    }, 100);
  };

  const displayItems = isEditing && editingItems ? editingItems : roomItems;


  return (
    // Wrap the Screen in ViewShot so that the Where to Next screen can
    //capture images of the players actual bedroom whenever they redecorate it
    <ViewShot 
      ref={viewShotRef} 
      style={{ flex: 1 }} 
      options={{ format: "jpg", quality: 0.9 }}
    >
      <View style={styles.container}>

        {!isEditing && ( <CustomHeader />)}

        {/* REDECORATE INSTRUCTIONS BOX */}
        {isEditing && (
          <View className="w-[75%] h-[60px] bg-[#EED8D3] opacity-90 self-center mt-[100px] border-dashed border-2">
            <View className="flex-row items-center mt-[10px] ml-3">
              <Image source={info} style={{ width: 24, height: 24, marginRight: 5 }}/>
              <Text className="">{"Drag an item to move it.\nUse the inventory to add or change items."}</Text>
            </View>
          </View>
        )}
      
      {/* This makes the left wall darker, so it appears 3D*/}
      <View style={styles.wall}>
          <View style={styles.wallOverlay} />
      </View>

      {/* FLOOR */}
      <Pressable disabled={!isEditing} pointerEvents="box-none">
        <Image source={displayItems.floor} style={styles.floor} contentFit="contain"/>
      </Pressable>

      {/* BED */}
      <DragItem
        item={{ 
          id: 'bed', 
          x: displayItems.bed.x, 
          y: displayItems.bed.y, 
          z: displayItems.bed.z, 
          scaleX: displayItems.bed.scaleX ?? 1, 
        }}
        draggable={isEditing}
        selected={isEditing && selectedItem === 'bed'}
        onPress={() => setSelectedItem('bed')}
        stopDrag={(id, x, y) => {
        if (isEditing) {
          setEditingItems(prev => ({
            ...prev,
            [id]: {...prev[id], x, y}
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
          z: displayItems.bookshelf.z,
          scaleX: displayItems.bookshelf.scaleX ?? 1,  
        }}
        draggable={isEditing}
        selected={isEditing && selectedItem === 'bookshelf'}
        onPress={() => setSelectedItem('bookshelf')}
        stopDrag={(id, x, y) => {
          if (isEditing) {
            setEditingItems(prev => ({
              ...prev,
              [id]: { ...prev[id], x, y}
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

  {/* RUG */}
  {displayItems.rug.image && (
    <DragItem
      item={{ 
        id: 'rug', 
        x: displayItems.rug.x, 
        y: displayItems.rug.y, 
        z: displayItems.rug.z,
        scaleX: displayItems.rug.scaleX ?? 1,
      }}
      draggable={isEditing}
      selected={isEditing && selectedItem === 'rug'}
      onPress={() => setSelectedItem('rug')}
      stopDrag={(id, x, y) => {
        if (isEditing) {
          setEditingItems(prev => ({
            ...prev,
            [id]: { ...prev[id], x, y }
          }));
        }
      }}
    >
      <Image source={displayItems.rug.image} style={{width:300, height:300}}contentFit="contain" />
    </DragItem>
  )}

  {/* TABLE */}
  {displayItems.table.image && (
    <DragItem
      item={{ 
        id: 'table', 
        x: displayItems.table.x, 
        y: displayItems.table.y, 
        z: displayItems.table.z,
        scaleX: displayItems.table.scaleX ?? 1,
      }}
      draggable={isEditing}
      selected={isEditing && selectedItem === 'table'}
      onPress={() => setSelectedItem('table')}
      stopDrag={(id, x, y) => {
        if (isEditing) {
          setEditingItems(prev => ({
            ...prev,
            [id]: { ...prev[id], x, y }
          }));
        }
      }}
    >
      <Image source={displayItems.table.image} style={{width:300, height:200}} contentFit="contain" />
    </DragItem>
  )}
      {/* This maps the items that can have multiple of that type placed */}
      {displayItems.wallItems &&
        Object.values(displayItems.wallItems).map(item => (
          <DragItem
            key={item.id}
            item={item}
            draggable={isEditing}
            selected={selectedItem === item.id}
            onPress={() => setSelectedItem(item.id)}
            stopDrag={(id, x, y) => {
              setEditingItems(prev => ({
                ...prev,
                wallItems: {
                  ...prev.wallItems,
                  [id]: {
                    ...prev.wallItems[id],
                    x,
                    y,
                  }
                }
              }));
            }}
          >
            <Image source={item.image} style={{ width: 80, height: 80 }} />
          </DragItem>
        ))
      }

      {/* INVENTORY OVERLAY */}
      {isEditing && openInventory && (
        <Inventory
        setOpenInventory={setOpenInventory}
        onPlaceItem={handlePlaceItem}
        currentRoom="Bedroom"
        refreshKey={openInventory ? "open" : "closed"}
      />
      )}

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
  </ViewShot>
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
    alignItems: 'center', 
  }
});

export default Bedroom;