import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import flowerlamp from '../assets/images/desk/Desk-flower-lamp.png';
import aglaonema from '../assets/images/desk/desk-plant-aglaonema.png';
import peacelily from '../assets/images/desk/desk-plant-peacelily .png';
import wallphotos from '../assets/images/desk/Desk-wall-photos.png';
import wallpaper1 from '../assets/images/desk/Desk-wallpaper-1.png';
import x from '../assets/images/x.png';

const DeskInventory = ({ setIsEditing, setOpenInventory, onPlaceItem }) => {
    const [activeTab, setActiveTab] = useState('Desk');

    const [items, setItems] = useState([
        { id: 'flower-lamp', name: "Flower lamp", image: flowerlamp, category: "Desk", tag:'deskItem', favorited: false },
        { id: 'aglaonema', name: "Aglaonema", image: aglaonema, category: "Desk", tag:'plant', favorited: true },
        { id: 'peacelily', name: "Peacelily", image: peacelily, category: "Desk", tag:'plant', favorited: false },
        { id: 'wall-photos', name: "Wall photos", image: wallphotos, category: "Desk", tag:'wallitem', favorited: true },
        { id: 'wallpaper-1', name: "Wall paper 1", image: wallpaper1, category: "Desk", tag:'wallpaper', favorited: false },
    ]);

    const filteredItems = items.filter(item => item.category === activeTab);

  return (
    <View style={styles.container}>
        <View className='absolute w-full h-full bg-black/30'/>

        <View className="w-full top-[20px] left-[20px] z-50">
            <Pressable onPress={() => setOpenInventory(false)} >
            <Image source={x} style={{ width: 36, height: 36 }}/>
            </Pressable>
        </View>
       

        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.bgBox}>
                
            <View className="flex-row flex-wrap justify-center mt-5">
                {filteredItems.map(item => (
                    <View className="items-center">
                        <TouchableOpacity 
                            key={item.id}
                            {...item} 
                            onPress={() => onPlaceItem(item)}
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
    backgroundColor: '#f9f1ef',
    flexGrow: 0,

    borderWidth: 1.5,
    borderColor: '#5F382B',
    borderRadius: 7,
    zIndex: 20,
  },

  itemCard: {
    width: 100,
    height: 140,
    backgroundColor: 'transparent',

    paddingTop: 15,
    margin: 10,
    marginBottom: 5,
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#472A2A',
    borderRadius: 20,
  },

  itemText: { fontSize: 12, marginTop: 5, color: '#5F382B' }

});

export default DeskInventory;