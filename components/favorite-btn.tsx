import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import emptyHeart from '../assets/images/Empty-heart.png';
import filledHeart from '../assets/images/Heart.png';

const FavoriteButton = ({ favorited, onPress }) => {

  return (
    <Pressable onPress={onPress} className='z-10'>
      <Image 
        source={ favorited ? filledHeart : emptyHeart }
        style={styles.heart}/>
    </Pressable>
  );
};

const styles = StyleSheet.create({

  heart: {
    width: 22,
    height: 18,
    marginLeft: 10,
  },

});

export default FavoriteButton;
