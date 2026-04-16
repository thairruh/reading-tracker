import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Link } from "expo-router";
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FriendsIcon from '../assets/images/FriendsIcon.svg';
import CustomHeader from '../components/banner';

const ChangeRoom = () => {
  const [bedroomImage, setBedroomImage] = useState(null);
  const [deskImage, setDeskImage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadSnapshots = async () => {

      const [bedUri, deskUri] = await Promise.all([
        AsyncStorage.getItem('bedroom_snapshot'),
        AsyncStorage.getItem('desk_snapshot')
      ]);

      if (bedUri) setBedroomImage(bedUri);
      if (deskUri) setDeskImage(deskUri);
    };
      loadSnapshots();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader title="Where to Next?" />

        <Link href="/DeskScreen" asChild>
          <Pressable style={styles.box}>
            {deskImage ? (
              <Image 
                source={{ uri: deskImage }} 
                style={styles.snapshotImage} 
                contentFit="cover"
              />
            ) : (
              <Text>No Snapshot Yet</Text>
            )}
          </Pressable>
        </Link>
        <Text style={styles.text}>Desk</Text>
      
      
        <Link href="/bedroom" asChild>
          <Pressable style={styles.box}>
            {bedroomImage ? (
              <Image 
                source={{ uri: bedroomImage }} 
                style={styles.snapshotImage} 
                contentFit="cover"
              />
            ) : (
              <Text>No Snapshot Yet</Text>
            )}
          </Pressable>
        </Link>
        <Text style={styles.text}>Bedroom</Text>
      

        <Link href="/friends" asChild>
          <Pressable style={styles.box}>
            <Image source={FriendsIcon} style={{ width: 129, height: 124 }}/>
          </Pressable>
        </Link>
        <Text style={styles.text}>Friends</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'flex-start',
    backgroundColor: '#FBF7F6',
  },
  scrollContainer: {
    alignItems: 'center',
  },

  box: {
    width: 295,
    height: 196,
    backgroundColor: '#F9ECE9',

    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',

    borderWidth: 7,
    borderColor: '#EEDBD3'
  },
  text: {
    paddingTop: 10,
    marginBottom: 30
  },
  snapshotImage: {
    width: 281, 
    height: 500,
    position: 'absolute',
    top: -250,
}
});

export default ChangeRoom;