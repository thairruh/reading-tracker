import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import inventory from '../assets/images/inventoryIcon.png';
import check from '../assets/images/v.png';
import x from '../assets/images/x.png';

const RedecorateBar = ({ bringForward, pushBack, rotateItem, setOpenInventory, storeItem, cancelEditing, saveEditing, selectedItem }) => {

  return ( 

    <View style={styles.container}>
      
      {/* CANCEL */}
        <TouchableOpacity onPress={cancelEditing}>
            <View>
                <Image source={x} style={{width: 20, height:20, alignSelf: 'center' }}/>
                <Text style={styles.text}>Cancel</Text>
            </View>
      
        </TouchableOpacity>

        <View style={styles.divder}/>
        
        
        {/* INVENTORY */}
        <TouchableOpacity onPress={() => setOpenInventory(true)}>
          <View className="items-center">
                <Image source={inventory} className="w-[35] h-[30px]"/>
                <Text style={styles.text}>Inventory</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divder}/>
      

        {/* DONE */}
        <TouchableOpacity onPress={saveEditing}>
            <View>
                <Image source={check} className="w-[20px] h-[15px]"/>
                <Text style={styles.text}>Done</Text>
            </View>
                
        </TouchableOpacity>
    </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
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
  divder: {
    height: '80%', 
    width:2, 
    backgroundColor:'#472A2A', 
    opacity: 0.5
  },
  text: {
    fontSize: 12,
  }
  
});

export default RedecorateBar;