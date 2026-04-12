import CustomHeader from '@/components/banner';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import plusIcon from '../assets/images/plusIcon.svg';

const Library = () => {
    const colors = ['#E5BABA', '#B7B7C6', '#BBC6B7'];
    const heights = [ 95, 105, 115, 130 ];

    const [bookColor, setBookColor] = useState(colors[0]);
    const [bookheight, setBookheight] = useState(heights[0]);

    const changeBookStyle = () => {
        const randomColor = Math.floor(Math.random() * colors.length);
        const randomHeight = Math.floor(Math.random() * heights.length);
        
        setBookColor(colors[randomColor]);
        setBookheight(heights[randomHeight]);
    }

  return (
    <View style={styles.container}>
        <CustomHeader title="Library" showGems={false}/>

        <View style={[styles.shelf, {marginTop: 20}]}>
            <View style={{flexDirection: 'row', position: 'absolute', bottom: 0}}>

                <View style={[styles.book, {backgroundColor: bookColor, height: bookheight}]}/>
                <View style={[styles.book, {backgroundColor: bookColor, height: bookheight}]}/>

                <View style={styles.transparentBox}>
                    <Image source={plusIcon} className="mt-1"/>
                </View>
            </View>
        </View>
        <View style={styles.shelf}></View>
        <View style={styles.shelf}></View>
        <View style={styles.shelf}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#90613E',
  },

  shelf: {
    width: '92%',
    height: 145,
    alignSelf: 'center',
    backgroundColor: "#785033",
    marginBottom: 30,
    borderWidth:2,
  },

  book: {
    width: 27,
    borderWidth: 1,
  },

  transparentBox: {
    width: 35,
    height: 35,
    borderRadius: 4,
    backgroundColor: "#C8AFAF",
    opacity: 55,
    alignItems: 'center',
  },


});

export default Library;