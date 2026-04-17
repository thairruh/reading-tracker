import React, {useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import gemIcon from '../assets/images/Diamond-red.png';
import { auth } from '@/src/firebase/config';
import { subscribeToUser } from '@/src/firebase/users';

const Gems = () => {
  const [gems, setGems] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = subscribeToUser(user.uid, (data) => {
      setGems(data.gems ?? 0);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
        
        <View style={styles.gemBox}>
            <Image source={gemIcon} style={styles.gem} resizeMode="contain"/>
        </View>

        <View style={styles.whiteBox}>
            <Text style={styles.text}>{gems}</Text>
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
    marginRight: 10,
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