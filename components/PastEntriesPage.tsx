import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { auth } from "@/src/firebase/config";
import { getUserJournalEntries } from "@/src/firebase/journal";

export type Entry = {
    id: string;
    userId?: string;
    book: string;
    date: string;
    notes: string;
    pagesRead: number;
    isPrivate: boolean;
    };

    type PastEntriesPageProps = {
    onSelectEntry: (entry: Entry) => void;
    };

    function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}-${date.getFullYear()}`;
    }

    export default function PastEntriesPage({
    onSelectEntry,
    }: PastEntriesPageProps) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadEntries() {
        try {
            setLoading(true);
            setErrorMessage("");

            const user = auth.currentUser;

            if (!user) {
            setEntries([]);
            return;
            }

            const data = await getUserJournalEntries(user.uid);
            setEntries(data as Entry[]);
        } catch (error: any) {
            setErrorMessage(error?.message ?? "Failed to load entries.");
        } finally {
            setLoading(false);
        }
        }

        loadEntries();
    }, []);

    return (
        <View className="flex-1 px-7 pt-4">
        <Text className="mb-6 text-center text-[29px] font-bold text-[#472A2A]">
            Past Entries
        </Text>

        <View className="flex-1">
            {loading ? (
            <View className="flex-1 items-center justify-center">
                <Text className="text-[15px] text-[#5b3b2e]">Loading entries...</Text>
            </View>
            ) : errorMessage ? (
            <View className="flex-1 items-center justify-center px-6">
                <Text className="text-center text-[15px] text-red-600">
                {errorMessage}
                </Text>
            </View>
            ) : entries.length === 0 ? (
            <View className="flex-1 items-center justify-center">
                <Text className="text-[15px] text-[#5b3b2e]">No past entries yet.</Text>
            </View>
            ) : (
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {entries.map((entry) => (
                <Pressable
                    key={entry.id}
                    onPress={() => onSelectEntry(entry)}
                    className="mb-8 mt-2 h-[110px] rounded-[10px] bg-[#EEDBD3] px-4 py-4"
                >
                    <View className="mb-3 flex-row justify-between">
                    <Text
                        className="mr-4 flex-1 text-[15px] font-medium text-[#2f211d]"
                        numberOfLines={1}
                    >
                        {entry.book || "Untitled"}
                    </Text>

                    <Text className="text-[15px] text-[#2f211d]">
                        {formatDate(entry.date)}
                    </Text>
                    </View>

                    <Text
                    className="text-[13px] leading-5 text-[#2f211d]"
                    numberOfLines={3}
                    >
                    {entry.notes || ""}
                    </Text>
                </Pressable>
                ))}
            </ScrollView>
            )}
        </View>
        </View>
    );
}