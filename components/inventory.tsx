import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import photo from '../assets/images/bedroom/Bedroom-bow-photo.png';
import flowerRug from '../assets/images/bedroom/Bedroom-circle-rug.png';
import pinkBed from '../assets/images/bedroom/Bedroom-frilly-bed-pink.png';
import whiteShelf from '../assets/images/bedroom/br-bookshelf-white.png';
import plainTable from '../assets/images/bedroom/br-plain-table.png';
import miniPC from '../assets/images/desk/Blue-desk-mini-comp.png';
import flowerLamp from '../assets/images/desk/Desk-flower-lamp.png';

import aglaonema from '../assets/images/desk/desk-plant-aglaonema.png';
import peacelily from '../assets/images/desk/desk-plant-peacelily.png';
import wallphotos from '../assets/images/desk/Desk-wall-photos.png';
import wallpaper1 from '../assets/images/desk/Desk-wallpaper-1.png';
import x from '../assets/images/x.png';
import CustomHeader from './banner';

 

const Inventory = ({ setOpenInventory, onPlaceItem, currentRoom }) => {
    const [activeTab, setActiveTab] = useState(currentRoom);

    const items = [
        { id: 'bow-photo', name: "Photo", image: photo, category: "Bedroom", tag:'wall-item', favorited: false },
        { id: 'frilly-bed-pink', name: "Frilly bed", image: pinkBed, category: "Bedroom", tag:'bed', favorited: true },
        { id: 'white-shelf', name: "White Bookshelf", image: whiteShelf, category: "Bedroom", tag:'bookshelf', favorited: false },
        { id: 'flower-rug', name: "Flower Rug", image: flowerRug, category: "Bedroom", tag:'rug', favorited: true },
        { id: 'plain-table', name: "Plain Table", image: plainTable, category: "Bedroom", tag:'table', favorited: false },

        { id: 'mini-pc', name: "Mini PC", image: miniPC, category: "Desk", tag:'desk-item' },
        { id: 'flower-lamp', name: "Flower Lamp", image: flowerLamp, category: "Desk", tag:'desk-item', width: 200, height: 200, favorited: false},
        { id: 'aglaonema', name: "Aglaonema", image: aglaonema, category: "Desk", tag:'plant', favorited: true },
        { id: 'peacelily', name: "Peacelily", image: peacelily, category: "Desk", tag:'plant', favorited: false },
        { id: 'wall-photos', name: "Wall photos", image: wallphotos, category: "Desk", tag:'wallItem', favorited: true },
        { id: 'wallpaper-1', name: "Wall paper 1", image: wallpaper1, category: ["Desk", "Bedroom"], tag:'wallpaper', favorited: false },
    ];

    const filteredItems = items.filter(item => 
      Array.isArray(item.category)
        ? item.category.includes(activeTab)
        : item.category === activeTab
    );

  return (
    <View style={styles.container}>
        <View className='absolute w-full h-full bg-black/30'/>

        <View className="w-full top-[20px] left-[20px] z-50">
            <Pressable onPress={() => setOpenInventory(false)} >
              <Image source={x} className="w-[36px] h-[36px]"/>
            </Pressable>
        </View>
       

        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.bgBox}>
            <View className='items-center'>
              <CustomHeader 
                title={currentRoom === 'Bedroom' ? 'Bedroom Inventory' : 'Desk Inventory'} 
                showGems={false}
                showBackArrow={false}/>
            </View>
            

            <View className="flex-row flex-wrap ml-3 mt-5">
                {filteredItems.map(item => (
                    <View key={item.id} className="items-center">
                        <TouchableOpacity 
                            onPress={() => { onPlaceItem(item);}}
                              style={styles.itemCard}
                        >
                            <Image source={item.image} className="w-[100px] h-[100px]" resizeMode="contain" />
                        </TouchableOpacity>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  scrollContainer: {
    justifyContent: 'center',
  },


  bgBox: {
    width: '90%',
    height: '70%',
    backgroundColor: '#f9efef',
    flexGrow: 0,

    borderWidth: 1.5,
    borderColor: '#5F382B',
    borderRadius: 7,
    zIndex: 20,
  },

  itemCard: {
    width: 100,
    height: 120,
    backgroundColor: '#fff9fc',

    paddingTop: 15,
    margin: 10,
    marginBottom: 5,
    alignItems: 'center',

    borderWidth: 2,
    borderColor: '#472c23',
    borderStyle: 'dashed',
    borderRadius: 15,

    shadowColor: '#5F382B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  itemText: { 
    fontSize: 14, 
    marginTop: 3,
    marginBottom: 5, 
    color: '#5F382B' }

});

export default Inventory;