import { Image } from 'expo-image';
import { Link } from "expo-router";
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FriendsIcon from '../assets/images/FriendsIcon.svg';
import CustomHeader from '../components/banner';

const ChangeRoom = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomHeader title="Where to Next?" />
      {/*
        will update links for desk and bedroom later
        i also want to try using react-native-view-shot to get
        live updates of the bedroom and desk view so these images reflect
        what the player's room actually looks like
      */}

        <Link href="/DeskScreen" asChild>
          <Pressable style={styles.box}>
            <Text>Snapshot of Desk</Text>
          </Pressable>
        </Link>
        <Text style={styles.text}>Desk</Text>
      
      
        <Link href="/bedroom" asChild>
          <Pressable style={styles.box}>
            <Text>Snapshot of Bedroom</Text>
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

    borderWidth: 7,
    borderColor: '#EEDBD3'
  },
  text: {
    paddingTop: 10,
    marginBottom: 30

  }
});

export default ChangeRoom;