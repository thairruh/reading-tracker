import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import check from '../assets/images/v.png';
import x from '../assets/images/x.png';

const RedecorateBar = ({ bringForward, pushBack, setOpenInventory, setStoreItem, cancelEditing, saveEditing }) => {

  return ( 

    <View style={styles.container}>
      
        <TouchableOpacity 
            onPress={cancelEditing}>
                
            <View style={{marginLeft: 10}}>
                <Image source={x} style={{width: 20, height:20, alignSelf: 'center' }}/>
                <Text>Cancel</Text>
            </View>
      
        </TouchableOpacity>

        <View style={{height: '80%', width:2, backgroundColor:'#472A2A', opacity: 0.5}}/>

        <TouchableOpacity onPress={pushBack}>
          <Text>Send Back</Text>
        </TouchableOpacity>

        <View style={{height: '80%', width:2, backgroundColor:'#472A2A', opacity: 0.5}}/>

        <TouchableOpacity onPress={bringForward}>
          <Text>Bring Forward</Text>
        </TouchableOpacity>

        <View style={{height: '80%', width:2, backgroundColor:'#472A2A', opacity: 0.5}}/>

        <TouchableOpacity onPress={() => setStoreItem(true)}>
          <Text>Store Item</Text>
        </TouchableOpacity>
        
        <View style={{height: '80%', width:2, backgroundColor:'#472A2A', opacity: 0.5}}/>

        <TouchableOpacity onPress={() => setOpenInventory(true)}>
          <Text>Inventory</Text>
        </TouchableOpacity>

        <View style={{height: '80%', width:2, backgroundColor:'#472A2A', opacity: 0.5}}/>
      
        <TouchableOpacity onPress={saveEditing}>
                
            <View style={{ marginRight: 10}}>
                <Image source={check} style={{width:30, height:20}}/>
                <Text>Done</Text>
            </View>
                
        </TouchableOpacity>
    </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 60,
    
    backgroundColor: '#EEDBD3',
    borderColor: '#472A2A',
    borderWidth: 1,

    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex:1,
  },
  
});

export default RedecorateBar;