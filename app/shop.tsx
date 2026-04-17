import ShopItem from '@/components/shop-item';
import ShopItemInfo from '@/components/shop-item-info';
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../components/banner';
import Tabs from '../components/tabs';
import { imageMap } from "../scripts/imageMap";
import { db } from "../src/firebase/config";
import { getShopItems, getCurrentUserInventory, purchaseItem } from '../src/firebase/shop';

type ShopItemType = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    tag?: string;
    favorited?: boolean;
    variants?: { id: string; image: string }[];
};

const Shop = () => {

    const [items, setItems] = useState<ShopItemType[]>([]);
    const [ownedItems, setOwnedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [activeTab, setActiveTab] = useState('Desk');
    const [selectedItem, setSelectedItem] = useState<ShopItemType | null>(null);

    useEffect(() => {
        loadShopData();
    }, []);

    // get shop items from database
    const loadShopData = async () => {
        try {
        setLoading(true);

        const [shopItems, inventory] = await Promise.all([
            getShopItems(),
            getCurrentUserInventory(),
        ]);

        setItems(shopItems as ShopItemType[]);
        setOwnedItems(inventory.map((item: any) => item.itemId ?? item.id));
        } catch (error) {
        console.error("Failed to load shop data:", error);
        } finally {
        setLoading(false);
        }
    };

    const handleBuy = async (item: ShopItemType) => {
        try {
        setBuying(true);
        await purchaseItem(item.id, item.price);

        const inventory = await getCurrentUserInventory();
        setOwnedItems(inventory.map((invItem: any) => invItem.itemId ?? invItem.id));
        } catch (error) {
        console.error("Failed to purchase item:", error);
        } finally {
        setBuying(false);
        }
    };

    // Tabs Filtering

    const filteredItems = items.filter((item) => {
        const matchesFavorites =
            activeTab === "Favorites" ? item.favorited : true;

        const matchesCategory =
            activeTab === "Favorites"
            ? true
            : item.category?.toLowerCase() === activeTab.toLowerCase();

        const isOwned = ownedItems.includes(item.id);

        return matchesFavorites && matchesCategory && !isOwned;
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
                            selectedItem={{
                                ...selectedItem,
                                owned: ownedItems.includes(selectedItem.id),
                            }}
                            selectedImage={imageMap[selectedItem.image]}
                            onClose={() => setSelectedItem(null)}
                            onBuy={() => handleBuy(selectedItem)}
                            buying={buying}
                        />

                    ) : (

                    <View className="flex-row flex-wrap ml-1" >
                        {filteredItems.map(item => (
                            <ShopItem 
                                key={item.id}
                                {...item} 
                                tag={item.tag}
                                owned={ownedItems.includes(item.id)}
                                image={imageMap[item.image]}
                                
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
    height: '80%',
    
    paddingTop: 10,
    marginTop: 30,

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