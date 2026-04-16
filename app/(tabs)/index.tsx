import { StyleSheet, Text, View } from 'react-native';


// import CustomHeader from '@/components/header';
// import LowerNav from '@/components/lowerNav';
import DeskScreen from '../DeskScreen';
import { NoteProvider } from '@/components/NoteContext';
import { StickerProvider } from '@/components/StickerContext';

export default function HomeScreen() {
  return (
    <StickerProvider>
    <NoteProvider>
    <View style={{ flex:1, backgroundColor: '#f3e6df' }}>
      <DeskScreen/>
  
    </View>
    </NoteProvider>
    </StickerProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
