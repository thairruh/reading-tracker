import ShopItem from '@/components/shop-item';
import ShopItemInfo from '@/components/shop-item-info';
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../components/banner';
import Tabs from '../components/tabs';
import { imageMap } from "../scripts/imageMap";
import { db } from "../src/firebase/config";

const Shop = () => {
    
    /*
    const [items, setItems] = useState([
        { id: 1, name: "Poster", price: 10, image: poster, category: "Desk", favorited: false },
        { id: 2, name: "Mini PC", price: 100, image: miniPC, category: "Desk", favorited: true },
        { id: 3, name: "Photo", price: 5, image: photo, category: "Desk", favorited: false },
    ]);
    */

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Desk');
    const [selectedItem, setSelectedItem] = useState(null);

    // get shop items from database
    useEffect(() => {
        const fetchShopItems = async () => {
            const snapshot = await getDocs(collection(db, 'shopItems'))
            
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setItems(data);
            setLoading(false);
        };
        fetchShopItems();
    }, []);

    if (loading) return <Text>Loading shop...</Text>

    // Tabs Filtering

    const filteredItems = items.filter(item => {
        if (activeTab === 'Favorites') return item.favorited;
        return item.category === activeTab;
    });


    /*

    const toggleFavorite = (id) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, favorited: !item.favorited }
                    : item
            )
        );
        
        setSelectedItem(prev =>
            prev && prev.id === id
            ? { ...prev, favorited: !prev.favorited }
            : prev
        );
    */
    

  return (
    <View style={styles.container}>
      
        <CustomHeader title="Shop" showGems={true}/>

        
        <View style={styles.wrapper}>
        {!selectedItem && (
            <Tabs
            tabs={[
                { label: 'Desk', color: '#FFB6B6' },
                { label: 'Bedroom', color: '#A7CFCB' },
                { label: 'Favorites', color: '#EFCB8C' },
            ]}
            onTabPress={(label) => setActiveTab(label)}
            />
        )}

            <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.bgBox}>
                
                {selectedItem ? (
                    
                    <ShopItemInfo
                        selectedItem={selectedItem}
                        onClose={() => setSelectedItem(null)}
                        onToggleFavorite={() => toggleFavorite(selectedItem.id)}
                    />
                ) : (

                <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                    {filteredItems.map(item => (
                        <ShopItem 
                            key={item.id}
                            {...item} 
                            image={imageMap[item.image]}
                            onToggleFavorite={() => toggleFavorite(item.id)}
                            onPress={() => setSelectedItem(item)}/>
                    ))}

                </View>
                )}
            </ScrollView>
        </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  scrollContainer: {
    justifyContent: 'center',
  },

  wrapper: {
    width: '90%',
    height: '100%',

    paddingTop: 10,
    marginTop: 0,

  },

  bgBox: {
    width: '100%',
    height: 720,
    backgroundColor: '#FBF7F6',

    paddingTop: 15,

    borderWidth: 1.5,
    borderColor: '#5F382B',
    borderRadius: 7,
    zIndex: 20,
  },

});

export default Shop;