import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import backArrow from '../assets/images/Arrow-left-circle.png';
import gemIcon from '../assets/images/Diamond-red.png';
import FavoriteButton from './favorite-btn';

const ShopItemInfo = ({ selectedItem, onClose, onToggleFavorite, item }) => {
    if (!selectedItem) return null;

    const [hasVariant, sethasVariant] = useState(false);
    return (
        <View style={styles.container}>
        
            <View style={{ flexDirection: 'row'}}>
                
                {/* Back button */}
                <Pressable onPress={onClose} className="ml-5">
                    <Image source={backArrow} style={{ width: 36, height: 36 }}/>
                </Pressable>

                {/* Favorite button */}
                <View style={{ position: 'absolute', right: 25, marginTop: 5 }}>
                    <FavoriteButton favorited={selectedItem.favorited} onPress={onToggleFavorite}/>
                </View>

            </View>

            <View style={styles.wrapper}>
                <Text className="text-xl">{selectedItem.name}</Text>

                <View style={styles.box}>
                    <Image source={selectedItem.image} style={styles.image}/>
                </View>

                <View style={{ flexDirection: 'row'}}>
                    <Image source={gemIcon} style={{ width: 18, height: 16, marginTop: 9 }}/>
                    <Text className="pl-2 font-semibold text-2xl">{selectedItem.price}</Text>
                </View>

                {hasVariant &&
                <View>
                    <Text>Color Variants</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                        <View style={styles.variantBox}>
                            
                        </View>
                    </View>
                </View>
                }

                <View style={styles.buyBtn}>
                    <Text className="text-lg">Buy</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 217,
    height: 252,
    margin: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5F382B',
    borderRadius: 12
  },
  variantBox: {
    width: 100,
    height: 140,
    margin: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5F382B',
    borderRadius: 20
  },
  
  image: {
    width: '100%',
    height: '100%',
  },

  buyBtn: {
    width: 100,
    height: 35,
    backgroundColor: '#CAD2BD',
    borderWidth: 1.5,
    borderColor: '#472A2A',
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 20
  }

});

export default ShopItemInfo;