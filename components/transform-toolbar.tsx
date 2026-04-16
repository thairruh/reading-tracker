import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import forwardIcon from '../assets/images/bring-forward.png';
import rotateIcon from '../assets/images/crop_rotate.png';
import sendBackIcon from '../assets/images/send-back.png';
import storeItemIcon from '../assets/images/storage_icon.png';


const TransformBar = ({ rotateItem, bringForward, pushBack, storeItem, selectedItem }) => {

  return ( 

    <View style={styles.container}>
        
        {/* Rotate ITEM */}
        <TouchableOpacity 
          onPress={rotateItem}
          disabled={!selectedItem}
          className="items-center mt-2"
        > 
          <Image source={rotateIcon} className="w-[30px] h-[30px] mb-1"/>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
        
        <View style={styles.divder}/>

        {/* SEND BACK */}
        <TouchableOpacity 
          onPress={pushBack}
          className="items-center "
        >
          <Image source={sendBackIcon} className="w-[20px] h-[20px] mb-1"/>
          <Text style={styles.text}>Send Back</Text>
        </TouchableOpacity>

        <View style={styles.divder}/>


        {/* BRING FORWARD */}
        <TouchableOpacity 
          onPress={bringForward}
          className="items-center justify-center"
        >
          <Image source={forwardIcon} className="w-[20px] h-[20px] mb-1"/>
          <Text style={styles.text}>Bring Forward</Text>
        </TouchableOpacity>

        <View style={styles.divder}/>


        {/* STORE ITEM */}
        <TouchableOpacity 
          onPress={storeItem}
          disabled={!selectedItem}
          className="items-center"
        > 
          <Image source={storeItemIcon} className="w-[30px] h-[30px] mb-1"/>
          <Text style={styles.text}>Store Item</Text>
        </TouchableOpacity>
        
 
    </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    width: '15%',
    height: 260,
    
    backgroundColor: '#EEDBD3',
    opacity: 0.8,
    borderColor: '#472A2A',
    borderWidth: 1,

    position: 'absolute',
    right: 10,
    bottom: '40%',
    alignSelf: 'center',

    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex:100,
  },
  divder: {
    height: 2, 
    width:'80%', 
    backgroundColor:'#472A2A', 
    opacity: 0.5
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  }
  
});

export default TransformBar;