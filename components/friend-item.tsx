import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import star from '../assets/images/Star.png';
import dashedLine from '../assets/images/dashed-line.png';

// Component for find friend page

const FriendItem = ({image, username, rank, id, bio, status, onAction}) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.rect}>
        <View style={styles.pfpBox}>
          <Image source={image} style={{width: '100%', height: '100%' }} resizeMode="cover"/>
        </View>

        <View style={styles.wrapper}>
          <Image source={star}/>
          <Text style={styles.rankText}>Rank</Text>
          <Text style={styles.rankNum}>{rank}</Text>
          <Text 
            className="ml-4" 
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {username}
          </Text>
        </View>

        {status === 'none' && (
          <Pressable style={styles.button}>
            <Text style={styles.btnText}>Befriend</Text>
          </Pressable>
        )}
        
        {status === 'request' && (
          <Pressable style={styles.button}>
            <Text style={styles.btnText}>Accept</Text>
          </Pressable>
        )}

        {status === 'friend' && (
          <View style={{}}>
            <Pressable 
              style={[styles.buttons,
                {
                position: 'absolute',
                right: 0,
                marginTop: 10,
                marginRight: 10,
                backgroundColor: '#CAD2BD',
                }]}>
              <Text style={styles.btnText}>Visit</Text>
            </Pressable>

            <Pressable 
              style={[styles.buttons,
                {
                position: 'absolute',
                right: 0,
                marginTop: 35,
                marginRight: 10,
                backgroundColor: '#FFB6B6',
                }]}>
              <Text style={styles.btnText}>Unfriend</Text>
            </Pressable>
          </View>
        )}

        {status === 'blocked' && (
          <Pressable style={styles.button}>
            <Text style={styles.btnText}>Unblock</Text>
          </Pressable>
        )}

        <Image source={dashedLine} style={{position: 'absolute', left:90, top:42}}/>
        <Text style={{fontSize:9, color:'#937C79', left:96, top:47}}>id {id}</Text>

        <View style={styles.bioRect}>
         
          <Text style={styles.bioText} numberOfLines={1}>{bio}</Text>
         
          <LinearGradient
            colors={['rgba(243,204,201,0)', '#F3CCC9']}
            style={styles.fade}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}/>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    position: 'absolute', 
    left:92, 
    top:24,
    flexDirection: 'row'
  },
  rect: {
    width: 340,
    height: 80,

    backgroundColor: '#EEDBD3',

    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#5C403F'
  },

  bioRect: {
    width: 338,
    height: 17,

    position: 'absolute',
    left: 0,
    top: 61,

    backgroundColor: '#F3CCC9',
    borderColor: '#CAD2BD',
    borderTopWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    
  },

  bioText: {
    marginLeft: 90,
    marginTop: 2,
    fontSize: 10,
  },

  fade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 200,
},

  pfpBox: {
    width: 75,
    height: 65,
    zIndex: 10,
    backgroundColor: '#EEDBD3',

    position: 'absolute',
    left: 10,
    top: 7,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B7A09A',

    overflow: 'hidden',
  },

  button: {
    width: 75,
    height: 24,

    position: 'absolute',
    left: 255,
    top: 25,
    
    backgroundColor: '#CAD2BD',
    borderRadius: 27
  },

   buttons: {
    width: 65,
    height: 22,
    borderRadius: 27
  },

  btnText: {
    alignSelf: 'center', 
    marginTop: 5, 
    fontSize:10,

  },

  rankText: {
    fontSize:12, 
    color:'#885555',
    marginLeft: 2
  },

  rankNum: {
    fontSize: 14,
    marginLeft: 2
  }
});

export default FriendItem;