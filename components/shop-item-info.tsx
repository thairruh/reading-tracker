import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import backArrow from '../assets/images/Arrow-left-circle.png';
import gemIcon from '../assets/images/Diamond-red.png';
import { imageMap } from "../scripts/imageMap";
import FavoriteButton from './favorite-btn';

const ShopItemInfo = ({ selectedItem, onClose, onToggleFavorite, selectedImage }) => {
    if (!selectedItem) return null;

    const hasVariants = selectedItem.variants && selectedItem.variants.length > 0;
    const [currentImage, setCurrentImage] = useState(selectedImage);

        // update main image to selected variant
    useEffect(() => {
        setCurrentImage(selectedImage);
    }, [selectedItem, selectedImage]);


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
                    <Image source={currentImage} style={styles.image} resizeMode="contain"/>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={gemIcon} style={{ width: 18, height: 16, marginTop: 9 }}/>
                    <Text className="pl-2 font-semibold text-2xl">{selectedItem.price}</Text>
                </View>

                {hasVariants && (
                <View style={styles.variantSection}>
                    <Text className='mt-5 mb-3 right-[100px]'>Color Variants</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                        {selectedItem.variants.map((variant, index) => {
                            // Variables declared here need the curly braces above
                            const variantImage = imageMap[variant.image];

                            return (
                                <TouchableOpacity 
                                    key={variant.id || index} 
                                    onPress={() => setCurrentImage(variantImage)}
                                    style={[
                                        styles.variantBox,
                                        currentImage === variantImage && styles.activeVariant
                                    ]}
                                >
                                    <Image 
                                        source={variantImage} 
                                        style={styles.variantImage} 
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                )}

                <TouchableOpacity style={styles.buyBtn}>
                    <Text className="text-lg mt-1 font-bold">Buy</Text>
                </TouchableOpacity>
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
  variantSection: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  variantBox: {
    width: 100,
    height: 140,
    padding: 5,
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
  },
  activeVariant: {
    borderColor: '#FFB6B6',
    borderWidth: 2,
  },
  variantImage: {
    width: '100%',
    height: '100%',
  },

});

export default ShopItemInfo;