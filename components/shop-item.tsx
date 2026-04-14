import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import gem from '../assets/images/gem.png';
import FavoriteButton from './favorite-btn';

const ShopItem = ({ name, price, image, favorited, onToggleFavorite, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>

      <View className="items-center">
          <View style={styles.box}>
              <FavoriteButton favorited={favorited} onPress={onToggleFavorite}/>
              <Image source={image} style={styles.wrapper} className="w-full h-full" resizeMode="contain"/>
          </View>
          
          <View className="mb-5 items-center">
            <Text className="mt-1">{name}</Text>
            <View className="flex-row">
                <Image className="w-4 h-3 mt-1 mr-1" source={gem}/>
               <Text>{price}</Text>
            </View>
           
          </View>
          
        </View>

    </Pressable>
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