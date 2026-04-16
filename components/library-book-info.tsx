import React, { useMemo } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import starFilled from '../assets/images/starFilled.png';
import starOutline from '../assets/images/starOutline.png';
import x from '../assets/images/x.png';

const ViewBook = ({ title, startDate, finishDate, status, onClose, rating }) => { 
        
        // Makes and memorizes the lines for the paper 
        const lines = useMemo(() => {
            return Array.from({
                length: Math.floor(Dimensions.get('window').height / 50),
            });
            }, []);
        
    return ( 
        <View style={styles.container}> 

        {/* CREATE NOTEBOOK LINES */}
        <View style={styles.paper}> 
            <View style={styles.lineContainer}> 
                {lines.map((_, index) => ( 
                    <View key={index} style={styles.paperLine}/> 
                ))} 
            </View> 

            <Pressable className="absolute top-[15px] left-[15px] zindex-2" onPress={onClose}> 
                <Image source={x} /> 
            </Pressable> 

            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>

                {/* DISPLAY CONTENT */}
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Start Date: {startDate}</Text>
                    {(status === 'Completed' || status === 'Dropped') && (
                        <Text style={styles.label}>Finish Date: {finishDate}</Text>
                     )}
                    <Text style={styles.label}>Status: {status}</Text>
                </View>
                
                {(status === 'Completed' || status === 'Dropped') && (
                    <View className='flex-row mt-[35px]'>
                        <Text style={[styles.label, {marginTop: 5, marginRight: 15}]}>Rating:</Text>
                        <View className='flex-row'>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <Image 
                                    key={num}
                                    source={num <= rating ? starFilled : starOutline} 
                                    style={styles.star}
                                />
                             ))}
                        </View>
                    </View>
                )}
            </View>
        </View> 
    </View> 
    );
}; 

const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        alignContent: 'center', 
        justifyContent: 'center', 
    }, 
    paper: { 
        backgroundColor: '#EEDBD3', 
        width: '90%', 
        height: '70%', 
        alignSelf: 'center', 
        borderWidth: 1, 
        marginTop: 150, 
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    }, 
    paperLine: { 
        width: '100%', 
        height: 2, 
        marginTop: 30, 
        backgroundColor: '#D7C3BB' 
    }, 
    lineContainer: { 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 60,
        width: '100%', 
    }, 
    content: {
        flex: 1,
        width: '85%',
        marginTop: 60,
        marginLeft: 40,
    },
    title: { 
        fontSize: 25, 
        color: '#472A2A', 
        textAlign: 'center',
    }, 

    infoSection: {
        marginTop: 40,
        gap: 15,
    },

    label: {
        fontSize: 16,
        color: '#6a4f4b',
        letterSpacing: 1,
    },

    value: {
        fontSize: 16,
        color: '#472A2A',
    },
    star: {
        width: 30,
        height: 30,
        marginHorizontal: 2,
    },

    dateText: {
        fontSize: 16,
        color: '#472A2A',
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 125,
        gap: 35, 
    },
}); 

export default ViewBook;