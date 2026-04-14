import { Checkbox } from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import x from '../assets/images/x.png';

const AddBook = ({ setBook, onClose }) => { 

    // possible colors and height's that the added books can be 
    const colors = ['#E5BABA', '#B7B7C6', '#BBC6B7']; 
    const heights = [ 115, 105, 95, 130 ]; 
    
    //randomly choose a color and height from each array 
    const handleAddBook = () => { 

        const randomColor = colors[Math.floor(Math.random() * colors.length)]; 
        const randomHeight = heights[Math.floor(Math.random() * heights.length)]; 

        const newBook = { 
            id: Date.now(), 
            title: title, 
            startDate: start, 
            finishDate: finish, 
            status: status, 
            color: randomColor, 
            height: randomHeight, 
        }; 
        
        setBook(prev => [...prev, newBook]); 
        onClose(); 
        }; 
        
        // Makes the lines for the paper 
        const lines = Array.from({ length: Math.floor(Dimensions.get('window').height / 50) }) 
        
        //for input fields 
        const [title, setTitle] = useState(''); 
        const [start, setStart] = useState(''); 
        const [finish, setFinish] = useState(''); 
        
        //for completed/dropped checkboxes 
        const [isCompleted, setCompleted] = useState(false); 
        const [isDropped, setDropped] = useState(false); 
        
        // status 
        const[status, setStatus] = useState('In Progress') 
        useEffect(() => {
            if (isCompleted) setStatus('Completed');
            else if (isDropped) setStatus('Dropped');
            else setStatus('In Progress');
        }, [isCompleted, isDropped]);
        
    return ( 
        <View style={styles.container}> 

        {/* CREATE NOTEBOOK LINES */}
        <View style={styles.paper}> 
            <View style={styles.lineContainer}> 
                {lines.map((_, index) => ( 
                    <View key={index} style={styles.paperLine}/> 
                ))} 
            </View> 

            <Pressable onPress={onClose}> 
                <Image source={x} className="absolute bottom-[570px] right-[135px]"/> 
            </Pressable> 

            <Text style={styles.title}>Add Book</Text> 
            

            {/* FORM INPUTS */}
            <View className="flex-row absolute top-[125px]"> 
                <Text style={styles.font}>Title:</Text> 
                <TextInput style={styles.input} placeholder="Type here..." onChangeText={newText => setTitle(newText)} value={title} /> 
            </View> 

            <View className="flex-row absolute top-[220px]"> 
                <Text style={styles.font}>Start Date:</Text> 
                <TextInput style={styles.input} placeholder="Type here..." onChangeText={newText => setStart(newText)} value={start} /> 
            </View> 

            <View className="flex-row absolute top-[315px]"> 
                <Text style={styles.font}>Finish Date:</Text> 
                <TextInput style={styles.input} placeholder="  Type here..." onChangeText={newText => setFinish(newText)} value={finish} /> 
            </View> 
            
            {/* CHECKBOXES*/} 
            <View className="flex-row absolute top-[415px]"> 
                <Text className="mr-[20px] text-[20px]" >Completed</Text> 
                <Checkbox 
                    style={styles.checkbox} 
                    value={isCompleted} 
                    onValueChange={(val) => {
                        setCompleted(val);
                        if (val) setDropped(false);
                    }}
                    color={isCompleted ? '#F4B7B7' : '#472A2A'} /
                > 
                <Text className="mr-[20px] ml-[40px] text-[20px]" >Dropped</Text> 
                <Checkbox 
                    style={styles.checkbox} 
                    value={isDropped} 
                    onValueChange={(val) => {
                        setDropped(val);
                        if (val) setCompleted(false);
                    }}
                    color={isDropped ? '#F4B7B7' : '#472A2A'} 
                /> 
            </View> 
            <Pressable onPress={handleAddBook} style={styles.doneBtn}> 
                <Text className="font-bold text-lg mt-1">Done</Text> 
            </Pressable> 
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
        alignItems: 'center', 
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
        marginTop: 60, 
        width: '100%', 
    }, 
    input: { 
        width: '60%', 
        height: 30, 
        borderWidth: 2, 
        borderColor: '#472A2A', 
        borderRadius: 5, 
    }, 
    font: { 
        marginRight: 30, 
        fontSize: 20, 
    }, 
    title: { 
        fontSize: 35, 
        color: '#472A2A', 
        position: 'absolute', 
        top: 30, 
    }, 
    checkbox: { 
        width: 24, 
        height: 24, 
        backgroundColor: '#472A2A' 
    }, 
    doneBtn: { 
        width: 100, 
        height: 35, 
        backgroundColor: '#CAD2BD', 
        borderWidth: 1.5, 
        borderColor: '#472A2A', 
        borderRadius: 9, 
        alignItems: 'center', 
        position: 'absolute', 
        bottom: 108, 
    }, 
}); 

export default AddBook;