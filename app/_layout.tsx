import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NoteProvider } from '@/components/NoteContext';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <NoteProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="DeskScreen" options={{ headerShown: false }} />
        <Stack.Screen name="Bulletin" options={{ headerShown: false }} />
        <Stack.Screen name="Sidebar" options={{ headerShown: false }} />
      </Stack>
      <StatusBar translucent backgroundColor="transparent" />
    </ThemeProvider>
    </NoteProvider>
  );
}