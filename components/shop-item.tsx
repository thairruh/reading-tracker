import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import gem from '../assets/images/gem.png';
import FavoriteButton from './favorite-btn';

type ShopItemProps = {
  name: string;
  price: number;
  image: any;
  favorited?: boolean;
  onPress: () => void;
  tag?: string;
  owned?: boolean;
};

const ShopItem = ({ name, price, image, favorited = false, onPress, tag, owned = false }) => {
  
  const isWallpaper = tag?.toLowerCase() === 'wallpaper';

  return (
    <Pressable style={styles.container} onPress={onPress}>

      <View className="items-center">
          <View style={[styles.box, isWallpaper && { padding: 0, overflow: 'hidden' }]}>
              <FavoriteButton favorited={favorited} onPress={() => {}}/>
              <Image 
                source={image} 
                style={isWallpaper ? styles.fullImage : styles.wrapper}
                className="w-full h-full" 
                resizeMode={isWallpaper ? "cover" : "contain"}
              />
          </View>
          
          <View className="mb-5 items-center">
            <Text className="mt-1">{name}</Text>
            <View className="flex-row">
                <Image className="w-4 h-3 mt-1 mr-1" source={gem}/>
               <Text>{price}</Text>
            </View>
           
            {owned && <Text className="text-xs mt-1 text-brown">Owned</Text>}
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
    overflow: 'hidden',
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
fullImage: {
    width: '100%',
    height: 140,
    position: 'absolute',
  }
});

export default ShopItem;