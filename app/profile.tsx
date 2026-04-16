import { Link, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import backArrow from '../assets/images/Arrow-left-circle.png';
import editIcon from '../assets/images/pencil.png';
import pfp1 from '../assets/images/pfp.jpg';
import gearIcon from '../assets/images/settings.png';
import sticker2 from '../assets/stickers/first-entry.png';
import sticker1 from '../assets/stickers/first-friend.png';
import Goal from '../components/profile-goal';
import { getCurrentUserProfile, updateCurrentUserProfile } from '@/src/firebase/profile';

const Profile = () => {

    const navigation = useNavigation();

    type ProfileUser = {
        username: string;
        bio: string;
        favoriteBook: string;
        currentlyReading: string;
        image: any;
        stickers: { id: number; image: any }[];
        goals: { id: number; name: string }[];
    };

    const [user, setUser] = useState<ProfileUser>({
    username: "",
    bio: "",
    favoriteBook: "",
    currentlyReading: "",
    image: pfp1,
    stickers: [
        { id: 1, image: sticker1 },
        { id: 2, image: sticker2 },
    ],
    goals: [
        { id: 1, name: "Read 1 chapter" },
        { id: 2, name: "Read for 3 consecutive days" },
        { id: 3, name: "Read 5 chapters in one day" },
    ],
});

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<ProfileUser>(user);

    useEffect(() => {
        loadProfile();
        }, []);

        useEffect(() => {
        if (isEditing) {
            setEditedUser(user);
        }
        }, [isEditing, user]);

        async function loadProfile() {
        try {
            const profile = await getCurrentUserProfile();

            setUser({
            username: profile.username,
            bio: profile.bio,
            favoriteBook: profile.favoriteBook,
            currentlyReading: profile.currentlyReading,
            image: pfp1,
            stickers: [
                { id: 1, image: sticker1 },
                { id: 2, image: sticker2 },
            ],
            goals: [
                { id: 1, name: "Read 1 chapter" },
                { id: 2, name: "Read for 3 consecutive days" },
                { id: 3, name: "Read 5 chapters in one day" },
            ],
            });
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={{ flexDirection: 'row', marginTop: 40, width: '100%' }}>

            {/* BACK BUTTON */}
            <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: 20}}>
                <Image source={backArrow} style={{width: 40, height: 40,}}/>
            </Pressable>

            {/* EDIT BUTTON */}
            <Pressable 
                onPress={() => setIsEditing(!isEditing)}
                style={{ position: 'absolute', right: 60, marginRight: 20, paddingTop:5 }}>
                <Image source={editIcon} style={{width: 25, height: 25,}}/>
            </Pressable>

            {/* SETTINGS BUTTON */}
            <Pressable style={{ position: 'absolute', right: 0, marginRight: 20 }}>
                <Link href='/settings'>
                    <Image source={gearIcon} style={{width: 40, height: 40}}/>
                </Link>
            </Pressable>
            
        </View>
        

        {/* PROFILE PICTURE */}
        <View style={styles.pfpContainer}>
            <Image source={user.image} style={{ width: '100%', height: '100%', borderRadius: 75 }} resizeMode="cover"/>
        </View>

        {/* PROFILE INFO */}

        {isEditing ? (
            <TextInput 
                value={editedUser.username}
                onChangeText={(text) =>
                    setEditedUser({ ...editedUser, username: text })}
                style={{ margin: 20, borderBottomWidth: 1 }}/>
        ):(
            <Text style={{ margin: 20}}>@{user.username}</Text>
        )}
        
        {/* SAVE / DISCARD CHANGES */}
        {isEditing && (
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                
                {/* SAVE CHANGES*/}
                <Pressable
                onPress={async () => {
                    try {
                    await updateCurrentUserProfile({
                        username: editedUser.username,
                        bio: editedUser.bio,
                        favoriteBook: editedUser.favoriteBook,
                        currentlyReading: editedUser.currentlyReading,
                    });

                    setUser(editedUser);
                    setIsEditing(false);
                    } catch (error) {
                    console.error("Failed to save profile:", error);
                    }
                }}
                style={{ marginRight: 20 }}
                >
                <Text>Save</Text>
                </Pressable>
                
                {/* DISCARD CHANGES*/}
                <Pressable
                onPress={() => setIsEditing(false)} 
                >
                <Text>Cancel</Text>
                </Pressable>

            </View>
        )}

        {/* ABOUT ME */}
        <View style={{ width: '90%', height: 100, backgroundColor: '#FBF7F6', marginBottom: 20}}>
            <Text style={ styles.text }>About Me</Text>
            {isEditing ? (
                <TextInput
                    value={editedUser.bio}
                    onChangeText={(text) =>
                        setEditedUser({ ...editedUser, bio: text })
                    }
                    multiline style={{ margin: 10}}/>
                ) : (
                <Text style={ styles.text }>{user.bio}</Text>
            )}
        </View>


        {/* FAVORITE BOOK */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <View style={{ width: '43%', height: 100, backgroundColor:'#EEDBD3', marginRight: 20}}>
                <Text style={ styles.text }>Favorite Book</Text>
                {isEditing ? (
                <TextInput
                    value={editedUser.favoriteBook}
                    style={{ margin: 10 }}
                    onChangeText={(text) =>
                        setEditedUser({ ...editedUser, favoriteBook: text })
                    }/>
                ) : (
                <Text style={ styles.text }>{user.favoriteBook}</Text>
            )}
            </View>

            <View style={{ width: '43%', height: 100, backgroundColor:'#EEDBD3' }}>
            <Text style={styles.text}>Currently Reading</Text>
            {isEditing ? (
                <TextInput
                value={editedUser.currentlyReading}
                style={{ margin: 10 }}
                onChangeText={(text) =>
                    setEditedUser({ ...editedUser, currentlyReading: text })
                }
                />
            ) : (
                <Text style={styles.text}>{user.currentlyReading}</Text>
            )}
            </View>
        </View>
        

        
        {/* STICKERS */}
        <Text style={ styles.titleText }>Stickers Earned</Text>
        <View style={{ width: '90%', height: 100, backgroundColor:'#EEDBD3', marginBottom: 20, flexDirection:'row'}}>
            {user.stickers.map((sticker) => (
                <Image
                    key={sticker.id}
                    source={sticker.image}
                    style={{
                    width: 60,
                    height: 60,
                    marginLeft: 20,
                    marginTop: 20
                    }}/>
            ))}
        </View>

        {/* GOALS */}
        <Text style={ styles.titleText }>Goals Met</Text>
            {user.goals.map((goals) => (
                <Goal key={goals.id} name={goals.name}/>
            ))}
        

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
  },

  pfpContainer: {
    width:150,
    height:150,
    borderRadius: 150/2,
    backgroundColor: '#c0c0c0'
  },
  text: {
    marginTop: 10, 
    marginLeft: 10,
    fontSize: 14 ,
  },

  titleText: {
    alignSelf: 'flex-start',
    marginTop: 10, 
    marginBottom: 10,
    marginLeft: 20,
    fontSize: 16 ,
  },



});

export default Profile;