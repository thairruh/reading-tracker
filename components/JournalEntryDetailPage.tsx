import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { deleteJournalEntry } from "@/src/firebase/journal";
import type { Entry } from "./PastEntriesPage";

type Props = {
    entry: Entry;
    onBack: () => void;
    onDeleteSuccess: () => void;
    onEdit: (entry: Entry) => void;
    };

    function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}-${date.getFullYear()}`;
    }

    export default function JournalEntryDetailPage({
    entry,
    onBack,
    onDeleteSuccess,
    onEdit,
    }: Props) {
    function handleDelete() {
        Alert.alert(
        "Delete entry?",
        "This action cannot be undone.",
        [
            { text: "Cancel", style: "cancel" },
            {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
                try {
                await deleteJournalEntry(entry.id);
                onDeleteSuccess();
                } catch (error: any) {
                Alert.alert("Error", error?.message ?? "Failed to delete entry.");
                }
            },
            },
        ]
        );
    }

    return (
        <View className="flex-1  px-4 ">

            <View className="flex-1  px-5 py-5">
                
            <View className="mb-4 flex-row items-center justify-between">
                
            </View>

            <View className="mb-6 flex-row items-start justify-between">
                <Text className="mr-4 flex-1 text-[20px] font-semibold text-[#2f211d]">
                {entry.book || "Untitled"}
                </Text>

                <Text className="text-[16px] text-[#2f211d] py-1">
                {formatDate(entry.date)}
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <Text className="text-[16px] leading-8 text-[#2f211d]">
                {entry.notes || "No notes written."}
                </Text>

                <View className="mt-6">
                <Text className="text-[14px] text-[#5b3b2e]">
                    Pages read: {entry.pagesRead}
                </Text>
                </View>
            </ScrollView>

            <View className="mt-5 flex-row items-center justify-between">
                <TouchableOpacity onPress={onBack}>
                    <Text className="text-[20px] py-2 text-[#5b3b2e]">←</Text>
                </TouchableOpacity>
                <View className="flex-row gap-3">
                <TouchableOpacity
                onPress={() => onEdit(entry)}
                className="rounded-[12px] bg-[#D8B4B0] px-5 py-3"
                >
                <Text className="font-medium text-[#2f211d]">Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                onPress={handleDelete}
                className="rounded-[12px] bg-[#C97A7A] px-5 py-3"
                >
                <Text className="font-medium text-white">Delete</Text>
                </TouchableOpacity>   
                </View>
            </View>
            
        </View>
        </View>
    );
}