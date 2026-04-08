import { StyleSheet, Text, View } from 'react-native';


import CustomHeader from '@/components/header';
import LowerNav from '@/components/lowerNav';

export default function HomeScreen() {
  return (
    <View style={{ flex:1, backgroundColor: '#f3e6df' }}>
      <CustomHeader/>
      <View style={styles.titleContainer}>
        <Text className="text-2xl font-bold mt-10 ml-10">Desk View</Text>
      </View> 
      <LowerNav/>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
