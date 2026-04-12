import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import pfp1 from '../assets/images/pfp.jpg';
import SearchGlass from '../assets/images/search-glass.svg';
import CustomHeader from '../components/banner';
import FriendItem from '../components/friend-item';
import Tabs from '../components/tabs';

import pfp2 from '../assets/images/pfp2.jpg';
import pfp3 from '../assets/images/pfp3.jpg';

const FindFriends = () => {
  
  const [users, setUsers] = useState([
          { id: 182739, username: "ILikeDucks", image: pfp1, status: 'none',rank: 12, bio: "This is the beginning of my bio. Click here to view my profil" },
          { id: 842742, username: "Bella", image: pfp2, status: 'friend', rank: 2, bio: "Hello nice to meet you" },
          { id: 622441, username: "justaguy", image: pfp2, status: 'request', rank: 16, bio: "Pls be my friend" },
          { id: 947264, username: "KimDokja", image: pfp3, status: 'blocked', rank: 8, bio: "I like to read" },
      ]);
  
  const [activeTab, setActiveTab] = useState('Find');

  const filteredUsers = users.filter(user => {
    if (activeTab === 'Find') return user.status === 'none';
    if (activeTab === 'Friends') return user.status === 'friend';
    if (activeTab === 'Requests') return user.status === 'request';
    if (activeTab === 'Blocked') return user.status === 'blocked';
  });

  const handleUserAction = (id, action) => {
    setUsers(prev =>
      prev.map(user => {
        if (user.id !== id) return user;

        switch (action) {
          case 'add':
            return { ...user, status: 'request' };

          case 'accept':
            return { ...user, status: 'friend' };

          case 'block':
            return { ...user, status: 'blocked' };

          case 'remove':
            return { ...user, status: 'none' };

          default:
            return user;
          }
        })
      );
    };

  return (
    <View style={styles.container}>
      
      <CustomHeader title="Friends" showGems={false} />

      
      <View style={styles.wrapper}>
      
        <Tabs
          tabs={[
            { label: 'Find', color: '#A7CFCB' },
            { label: 'Friends', color: '#CAD2BD' },
            { label: 'Requests', color: '#EFCB8C' },
            { label: 'Blocked', color: '#FFB6B6' },
          ]}
          onTabPress={(label) => setActiveTab(label)}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.bgBox}>
          
          {/* SEARCH BOX */}
          <View style={styles.searchBox}>
            <Image source={SearchGlass} style={styles.searchGlass}/>
            <Text style={styles.placeholderTxt}>Search by ID</Text>
          </View>

          {/* List friend items*/}
          {filteredUsers.map(user => (
            <FriendItem
              key={user.id}
              {...user}
              onAction={(action) => handleUserAction(user.id, action)}
            />
          ))}

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  scrollContainer: {
    justifyContent: 'center',
  },

  wrapper: {
    width: 365,
    height: 720,

    paddingTop: 10,
    marginTop: 0,

  },

  bgBox: {
    width: 365,
    height: 720,
    backgroundColor: '#FBF7F6',

    paddingTop: 15,

    borderWidth: 1.5,
    borderColor: '#5F382B',
    borderRadius: 7,
    zIndex: 20,
  },

  searchBox: {
    width: 140,
    height: 20,

    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 20,

    backgroundColor: '#F1E2DC',

    borderWidth: 1,
    borderColor: '#5C403F',
    borderRadius: 4
  },

  searchGlass: {
    width: 14,
    height: 13,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 2
  },
  
  placeholderTxt: {
    fontSize: 12,
    color: '#CFB5AA',
    marginTop: 1
  }

});

export default FindFriends;

