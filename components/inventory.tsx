import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import photo from '../assets/images/bedroom/Bedroom-bow-photo.png';
import flowerRug from '../assets/images/bedroom/Bedroom-circle-rug.png';
import pinkBed from '../assets/images/bedroom/Bedroom-frilly-bed-pink.png';
import whiteShelf from '../assets/images/bedroom/br-bookshelf-white.png';
import plainTable from '../assets/images/bedroom/br-plain-table.png';
import x from '../assets/images/x.png';


const Inventory = ({ setIsEditing, setOpenInventory, onPlaceItem }) => {
    const [activeTab, setActiveTab] = useState('Bedroom');

    const [items, setItems] = useState([
        { id: 'bow-photo', name: "Photo", image: photo, category: "Bedroom", tag:'wall-item', favorited: false },
        { id: 'frilly-bed-pink', name: "Frilly bed", image: pinkBed, category: "Bedroom", tag:'bed', favorited: true },
        { id: 'white-shelf', name: "White Bookshelf", image: whiteShelf, category: "Bedroom", tag:'bookshelf', favorited: false },
        { id: 'flower-rug', name: "Flower Rug", image: flowerRug, category: "Bedroom", tag:'rug', favorited: true },
        { id: 'plain-table', name: "Plain Table", image: plainTable, category: "Bedroom", tag:'table', favorited: false },
    ]);

    const filteredItems = items.filter(item => item.category === activeTab);

  return (
    <View style={styles.container}>
        <View className='absolute w-full h-full bg-black/30'/>

        <View className="w-full top-[20px] left-[20px] z-50">
            <Pressable 
              onPress={() => setOpenInventory(false)} 
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Image source={x} className="w-[36px] h-[36px]"/>
            </Pressable>
        </View>
       

        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.bgBox}>
                
            <View className="flex-row flex-wrap justify-center mt-5">
                {filteredItems.map(item => (
                    <View key={item.id} className="items-center">
                        <TouchableOpacity 
                            onPress={() => {
                              console.log("INVENTORY CLICKED:", item); 
                              onPlaceItem(item);}}
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

export default Inventory;