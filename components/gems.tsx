import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import gemIcon from '../assets/images/Diamond-red.png';

const Gems = () => {
  return (
    <View style={styles.container}>
        
        <View style={styles.gemBox}>
            <Image source={gemIcon} style={styles.gem} resizeMode="contain"/>
        </View>

        <View style={styles.whiteBox}>
            <Text style={styles.text}>999</Text>
        </View>
        
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
  },

  whiteBox: {
    width: 70,
    height: 21,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: '#472A2A',
    borderWidth: 1,
  },
  gemBox: {
    alignItems: 'center',
    width: 20,
    height: 21,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#EEDBD3',
    borderColor: '#472A2A',
    borderWidth: 1,
  },
  gem: {
    width: '80%',
    height: '80%',
    marginTop: 2,
  },
  text: {
    alignSelf: 'flex-end',
    marginRight: 10,
  }
});

export default Gems;