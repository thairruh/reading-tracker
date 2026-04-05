import { ImageBackground } from 'expo-image';
import { useNavigation } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import backArrow from '../assets/images/Arrow-left-circle.png';
import Banner from '../assets/images/friends-header.svg';
import Gems from './gems';

export default function CustomHeader({title, showGems}) {
  const navigation = useNavigation();

  return (
    <View>
      
      <ImageBackground source={Banner} style={{width: 464, height:155 }} />

      {/* This component creates the header used for the
          shop, friends, and library pages */}
      <View
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Back button */}
        {navigation.canGoBack() && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              left: 35,
              padding: 10,
            }}
          >
            <Image source={backArrow} style={{ width: 36, height: 36 }}/>
          </Pressable>
        )}

        {/* Title */}
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {title}
        </Text>

        { showGems && (
          <View style={{ position: 'absolute', right: 0, marginRight: 30 }}>
            <Gems/>
          </View>
        )}

      </View>
    </View>
  );
}

