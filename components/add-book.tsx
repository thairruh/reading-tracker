import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import starFilled from '../assets/images/starFilled.png';
import starOutline from '../assets/images/starOutline.png';
import x from '../assets/images/x.png';

const AddBook = ({ setBook, onClose }) => { 

    const[rating, setRating] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [finishDate, setFinishDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showFinishPicker, setShowFinishPicker] = useState(false);

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
            rating: rating,
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
        
        // date picker
        const onStartChange = (event, selectedDate) => {
            setShowStartPicker(false); 
            if (selectedDate) setStartDate(selectedDate);
        };

        const onFinishChange = (event, selectedDate) => {
            setShowFinishPicker(false);
            if (selectedDate) setFinishDate(selectedDate);
        };
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
                <Image source={x} className="absolute top-[30px] right-[135px]"/> 
            </Pressable> 

            <Text style={styles.title}>Add Book</Text> 
            

            {/* FORM INPUTS */}
            <View style={styles.formContainer}>

                <View className="flex-row items-center"> 
                    <Text style={styles.font}>Title:</Text> 
                    <TextInput style={styles.input} placeholder="Type here..." onChangeText={newText => setTitle(newText)} value={title} /> 
                </View> 

                <View className="flex-row items-center"> 
                    <Text style={styles.font}>Start Date:</Text> 
                    <Pressable style={styles.dateDisplay} onPress={() => setShowStartPicker(true)}>
                        <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
                    </Pressable>
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onStartChange}
                        />
                    )}
                </View> 


                {(isCompleted || isDropped) && (
                    <View className="flex-row items-center"> 
                        <Text style={styles.font}>Finish Date:</Text> 
                        <Pressable style={styles.dateDisplay} onPress={() => setShowFinishPicker(true)}>
                            <Text style={styles.dateText}>{finishDate.toLocaleDateString()}</Text>
                        </Pressable>

                        {showFinishPicker && (
                            <DateTimePicker
                                value={finishDate}
                                mode="date"
                                display="default"
                                onChange={onFinishChange}
                            />
                        )}
                    </View> 
                )}
                
                {/* CHECKBOXES*/} 
                <View className="flex-row items-center"> 
                    <Text className="mr-[20px] text-[20px]" >Completed</Text> 
                    <Checkbox 
                        style={styles.checkbox} 
                        value={isCompleted} 
                        onValueChange={(val) => {
                            setCompleted(val);
                            if (val) setDropped(false);
                        }}
                        color={isCompleted ? '#F4B7B7' : '#472A2A'} 
                    /> 
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
            </View>
        
            {/* RATING SECTION */}

            {(isCompleted || isDropped) && (           
                <View className='flex-row items-center mt-10'>
                    <Text style={styles.font} className='mt-1 mr-5'>Rating:</Text>
                    <View className='flex-row'>
                        {[1, 2, 3, 4, 5].map((starNumber) => (
                        <Pressable 
                            key={starNumber} 
                            onPress={() => setRating(starNumber)}>
                            <Image 
                                source={starNumber <= rating ? starFilled : starOutline} 
                                style={styles.star}/>
                        </Pressable>
                        ))}
                    </View>
                </View>
            )}

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
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 125,
        gap: 35, 
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
        position: 'absolute',
        zIndex: -1,
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
        bottom: 70, 
    }, 
    star: {
        width: 30,
        height: 30,
        marginHorizontal: 2,
    },
    dateDisplay: {
        flex: 1,
        height: 30,
        borderWidth: 2,
        borderColor: '#472A2A',
        borderRadius: 5,
        justifyContent: 'center',
        paddingLeft: 10,
        //backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    dateText: {
        fontSize: 16,
        color: '#472A2A',
    },
}); 

export default AddBook;