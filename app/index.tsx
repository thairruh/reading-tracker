import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import JournalModal from "../components/JournalModal";
import { useNavigation } from "expo-router";

export default function HomeScreen() {
  const [journalOpen, setJournalOpen] = useState(false);

  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: journalOpen ? { display: "none" } : undefined,
    });
  }, [journalOpen]);

  return (
    <View className="flex-1 items-center justify-center bg-[#f8e8d8]">
      <Text className="mb-4 text-2xl font-bold">Desk Screen</Text>

      <Pressable
        onPress={() => setJournalOpen(true)}
        className="rounded-2xl bg-[#b57edc] px-6 py-4"
      >
        <Text className="text-lg font-semibold text-white">Open Journal</Text>
      </Pressable>

      <JournalModal
        visible={journalOpen}
        onClose={() => setJournalOpen(false)}
      />
    </View>
  );
}