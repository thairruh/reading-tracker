import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import bookshelf from '../assets/images/bedroom/BR-bookshelf-plain.png';
import bed from '../assets/images/bedroom/Br-checker-bed-pink.png';
import floor from '../assets/images/bedroom/BR-floor-wood-light.png';
import CustomHeader from '../components/header';
import LowerNav from '../components/lowerNav';

const Bedroom = () => {
  return (
    <View style={styles.container}>
    <CustomHeader />

    <View style={styles.wall}>
        <View style={styles.wallOverlay} />
    </View>

    <Image source={floor} style={styles.floor} contentFit="contain"/>
    <Image source={bed} style={styles.bed} contentFit="contain"/>
    
    <View 
      style={{
      position: 'absolute',
      top: 290,
      left: 150,
      zIndex: 1,
      }}>
      <Link href="./library" asChild>
        <Pressable>
          <Image source={bookshelf} style={styles.bookshelf}/>
        </Pressable>
      </Link>
    </View>

    <LowerNav/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  wall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#d0d6c6',
    zIndex: -1,
  },
  wallOverlay: {
    width: 205,
    height: 700,
    position: 'absolute',
    right: 0,
    backgroundColor: '#929292',
    opacity: 0.3
  },
  floor: {
    position: 'absolute',
    top: 250,
    width: '100%',
    height: '100%',
  },
  bed: {
    width: '70%',
    height: '40%',
    position: 'absolute',
    top: 465,
    left: 0,
    zIndex: 1
  },
  bookshelf: {
    width: 137,
    height: 252,
    
  },
});

export default Bedroom;