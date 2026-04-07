import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { logout } from "@/src/firebase/auth";
import JournalModal from "@/components/JournalModal";

export default function DeskScreen() {
    const [journalVisible, setJournalVisible] = useState(false);

    async function handleLogout() {
        try {
        await logout();
        router.replace("/auth-test");
        } catch (error: any) {
        Alert.alert("Logout error", error.message ?? "Something went wrong");
        }
    }

    return (
        <View className="flex-1 items-center justify-center bg-[#f7efe7] px-6">
        <Text className="mb-2 text-4xl font-bold text-[#5b3b2e]">Desk Screen</Text>
        <Text className="mb-8 text-center text-base text-[#7a5c4d]">
            Logged in successfully.
        </Text>

        <Pressable
            onPress={() => setJournalVisible(true)}
            className="mb-3 w-full max-w-[320px] items-center rounded-2xl bg-[#d9b8ff] py-4"
        >
            <Text className="font-semibold text-[#3d2352]">Open Journal</Text>
        </Pressable>

        <Pressable
            onPress={handleLogout}
            className="w-full max-w-[320px] items-center rounded-2xl bg-gray-500 py-4"
        >
            <Text className="font-semibold text-white">Logout</Text>
        </Pressable>

        <JournalModal
            visible={journalVisible}
            onClose={() => setJournalVisible(false)}
        />
        </View>
    );
}