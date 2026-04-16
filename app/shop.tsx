import ShopItem from '@/components/shop-item';
import ShopItemInfo from '@/components/shop-item-info';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import miniPC from '../assets/images/desk/Blue-desk-mini-comp.png';
import poster from '../assets/images/desk/Desk-wall-photos.png';
import photo from '../assets/images/desk/White-frame-desk-photo.png';
import CustomHeader from '../components/banner';
import Tabs from '../components/tabs';

const DeskShop = () => {

    const [items, setItems] = useState([
        { id: 1, name: "Poster", price: 10, image: poster, category: "Desk", favorited: false },
        { id: 2, name: "Mini PC", price: 100, image: miniPC, category: "Desk", favorited: true },
        { id: 3, name: "Photo", price: 5, image: photo, category: "Desk", favorited: false },
    ]);

    const [activeTab, setActiveTab] = useState('Desk');

    const filteredItems = items.filter(item => {
        if (activeTab === 'Favorites') return item.favorited;
        return item.category === activeTab;
    });

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
    };

    const [selectedItem, setSelectedItem] = useState(null);

  return (
    <View style={styles.container}>
      
        <CustomHeader title="Shop" showBackArrow={true} showGems={true}/>

        
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  scrollContainer: {
    justifyContent: 'center',
  },

  wrapper: {
    width: 365,
    height: 720,

    paddingTop: 10,
    marginTop: 0,

  },

  bgBox: {
    width: 365,
    height: 720,
    backgroundColor: '#FBF7F6',

    paddingTop: 15,

    borderWidth: 1.5,
    borderColor: '#5F382B',
    borderRadius: 7,
    zIndex: 20,
  },

});

export default DeskShop;