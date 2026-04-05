import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import FavoriteButton from './favorite-btn';

const ShopItem = ({ name, price, image, favorited, onToggleFavorite }) => {
  return (
    <View style={styles.container}>

        <View style={{ alignItems: 'center' }}>
            <View style={styles.box}>
                <FavoriteButton favorited={favorited} onPress={onToggleFavorite}/>
                <Image source={image} style={styles.wrapper} className="w-full h-full" resizeMode="contain"/>
            </View>
            
            <Text className="mt-1">{name}</Text>
            <Text>{price}</Text>
        </View>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    alignItems: 'flex-start'
  },
  box: {
    width: 100,
    height: 140,
    backgroundColor: 'transparent',

    paddingTop: 15,

    borderWidth: 1,
    borderColor: '#472A2A',
    borderRadius: 20,
  },
  wrapper: {
  position: 'absolute',
  top: 10,
  left: 0,
  right: 0,
  bottom: 0,

  justifyContent: 'center',
  alignItems: 'center',
},
});

export default ShopItem;