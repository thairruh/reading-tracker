import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Image, Text, View, Pressable } from "react-native";
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

interface EditBarProps {
    donePressed?: () => void;
}

export const EditBar = ({ donePressed }: EditBarProps) => {
    const router = useRouter();

    return (
        <View className="flex-row absolute bottom-56 w-full">
            <Pressable style={styles.buttonstyle} className="border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/delete.png')}
                />
                <Text style={styles.text}>Delete</Text>
            </Pressable>

            <Pressable 
                onPress={() => router.navigate('/bulletin-add-note')}
                style={styles.buttonstyle} 
                className="border-l-0 border-r-hairline"
                >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/add_box.png')}
                />                
                <Text style={styles.text}>Add Note</Text>
            </Pressable>

            <Pressable style={styles.buttonstyle} className="border-l-0 border-r-hairline">
                <Image
                    style={styles.image}
                    source={require('../figma-icons/edit.png')}
                />                
                <Text style={styles.text}>Edit Note</Text>
            </Pressable>

            <Pressable 
                style={styles.buttonstyle} 
                className="border-l-0 border-r-hairline"
                >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/add_sticker.png')}
                />    
                <Text style={styles.text}>Stickers</Text>
            </Pressable>

            <Pressable  
                onPress={donePressed} 
                style={styles.buttonstyle}
                className="border-l-0"
            >
                <Image
                    style={styles.image}
                    source={require('../figma-icons/check.png')}
                />    
                <Text style={styles.text}>Done</Text>
            </Pressable>

        </View>
    );
}

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

export default EditBar;

