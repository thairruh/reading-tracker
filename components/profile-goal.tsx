import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import star from '../assets/images/goalStar.png';

const Goal = ({ name }) => {

  return (
    <View style={styles.container}>
        <Text style={styles.text}>{name}</Text>

        <View style={{ flexDirection: 'row', width: '85%', marginRight:15 }}>
            <View style={styles.goalBar}/>
            <Image source={star} style={{ height:60, width:60, position:'absolute', right:-35, top:-10 }}/>
        </View>
        

    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    width: '90%',
    height: 100,

    alignItems: 'center',
    marginBottom: 20,

    borderColor:'#472A2A',
    borderWidth: 2,
    backgroundColor: '#FBF7F6',
  },

  goalBar: {
    width:'100%',
    height:35,
    borderColor: '#472A2A',
    borderWidth: 2,
    backgroundColor: '#F4B7B7',
  },
  text: {
    alignSelf: 'flex-start',
    margin:10,
    fontSize: 16 ,
  },



});

export default Goal;