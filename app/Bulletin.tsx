import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View, Image, Text, StyleSheet, TouchableOpacity, } from "react-native";


export default function Bulletin() {
    const navigation = useRouter();
    const [isVisible, setIsVisible] = React.useState(false);

  return (
    
    <View className="flex-1 relative bg-light-pink">
      
        <Pressable
        onPress={() => navigation.replace('/DeskScreen')}
        className="absolute top-16 left-5 "
        >
            <Image 
                source={require('../figma-icons/arrow-left-circle.png') }
                className="w-16 h-16"
            />
        </Pressable>

        {/* Bulletin Board */}
        <View className="absolute top-1/3 w-full h-full">
            <Pressable
            onPress={() => setIsVisible(true)}
            >
                <View className="w-full h-72 bg-bulletin-board border-[10px] border-bulletin-border" />

            </Pressable>
            
            {isVisible && (
                <View>

                </View>
            )}
        </View>

        {/* Edit Bar */}
        <View className="flex-row absolute bottom-56 ml-10">
            <TouchableOpacity style={styles.buttonstyle} className="border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/delete.png')}
                />
                <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonstyle} className="border-l-0 border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/add_box.png')}
                />                
                <Text style={styles.text}>Add Note</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonstyle} className="border-l-0 border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/edit.png')}
                />                
                <Text style={styles.text}>Edit Note</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonstyle} className="border-l-0 border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/add_sticker.png')}
                />    
                <Text style={styles.text}>Stickers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonstyle} className="border-l-0">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/check.png')}
                />    
                <Text style={styles.text}>Done</Text>
            </TouchableOpacity>

        </View>
    
    </View>

  );
};

const styles = StyleSheet.create({
    buttonstyle: {
        width: 65,
        height: 65,
        backgroundColor: '#EEDBD3',
        borderWidth: 2,
        borderColor: '#472A2A',
    },
    text: {
        marginTop: 'auto',
        textAlign: 'center',
        color: '#472A2A',
        fontWeight: 'bold',
        // fontSize: 12,
    },
    image: {
        // display: 'flex',
        // justifyContent: 'center',
        width: '50%',
        height: 50,
        alignSelf: 'center',
        marginBottom: -10,
        resizeMode: 'contain',
        
    }
})
