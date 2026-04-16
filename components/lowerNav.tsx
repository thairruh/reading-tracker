import { ImageBackground } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import shopBtn from '../assets/images/shop_btn.png';

const LowerNav = ({ startEditing }) => {

  

  return (

    /* REDECORATE AND SHOP BUTTONS*/
    <View style={styles.container}>

      <View style={{ position: 'absolute',right: 20,bottom: 0,}}>
        <Link href="/shop" asChild>
          <Pressable>
            <ImageBackground source={shopBtn} style={styles.shopBtn} contentFit="contain">
              <Text style={{marginTop: 50}}>Shop</Text>
            </ImageBackground>
          </Pressable>
        </Link>
      </View>


      <View style={{ position: 'absolute',right: -30,bottom: -20,}}>
        <Pressable onPress={startEditing} style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Text className="text-lg mr-2">Redecorate</Text>
          </View>
        </Pressable>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FF0000',
  },
  outerCircle: {
    width: 159,
    height: 159,
    borderRadius: 159 / 2, 
    backgroundColor: 'white',
    borderColor: "#684D4C",
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center', 
    zIndex: 1,

  },
  innerCircle: {
    width: 140,
    height: 140,

    borderRadius: 140 / 2, 
    backgroundColor: '#EEDBD3',

    justifyContent: 'center',
    alignItems: 'center', 
  },
  shopBtn: {
    width: 200,
    height: 90,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 40,
    zIndex:10,

  },
});

export default LowerNav;