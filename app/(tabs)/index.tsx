import { StyleSheet, Text, View } from 'react-native';


// import CustomHeader from '@/components/header';
// import LowerNav from '@/components/lowerNav';
import DeskScreen from '../DeskScreen';
import { NoteProvider } from '@/components/NoteContext';

export default function HomeScreen() {
  return (
    <NoteProvider>
    <View style={{ flex:1, backgroundColor: '#f3e6df' }}>
      <DeskScreen/>
  
    </View>
    </NoteProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
