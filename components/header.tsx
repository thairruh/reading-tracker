import { ImageBackground } from 'expo-image';
import { Link, useNavigation } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Banner from '../assets/images/header.png';
import menuIcon from '../assets/images/menu.svg';
import profile from '../assets/images/profileIcon.png';
import Gems from './gems';

export default function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View>
      
      <ImageBackground source={Banner} style={{width: '100%', height:155 }} className="object-contain" />

      {/* This component creates the header used for the
          Desk and Bedroom pages*/}

      <View style={{ position: 'absolute', left: 83,top: 45,}}>
        <Link href="/profile" asChild>
          <Pressable style={styles.smallPinkCircle}>
            <View style={styles.smallWhiteCircle}>
              <Image source={profile}
              style={{ width: 35, height:40, marginTop: 12, marginLeft: 25}}/>
            </View>
          </Pressable>
        </Link>
      </View>

      <View style={{ position: 'absolute', left: -57,top:0,}}>
        <Link href="/change-room" asChild>
          <Pressable style={styles.pinkCircle}>
            <View style={styles.whiteCircle}>
              <Text 
              style={{alignSelf:'center', marginTop: 50, marginLeft: 30}}
              className='font-bold text-lg'>
              Change {"\n"} Room
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
      
      <View style={{ flexDirection: 'row', position: 'absolute', right: 0}}>
        <Gems/>
        <Image source={menuIcon}/>
      </View>
      
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  
  whiteCircle: {
    width: 151,
    height: 142,
    borderRadius: 151 / 2, 
    backgroundColor: 'white'
  },
  pinkCircle: {
    width: 171,
    height: 160,

    borderRadius: 171 / 2, 
    backgroundColor: '#EEDBD3',
    borderColor: "#684D4C",
    borderWidth: 3,

    justifyContent: 'center',
    alignItems: 'center', 
  },

  smallWhiteCircle: {
    width: 72,
    height: 72,
    borderRadius: 72 / 2, 
    backgroundColor: 'white'
  },
  smallPinkCircle: {
    width: 84,
    height: 84,

    borderRadius: 84 / 2, 
    backgroundColor: '#EEDBD3',
    borderColor: "#684D4C",
    borderWidth: 1.5,

    justifyContent: 'center',
    alignItems: 'center', 
  },

});




