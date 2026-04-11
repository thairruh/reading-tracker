import { useState } from "react";
import { View, Text, Pressable, TextInput, Keyboard, Alert, Image, } from "react-native";
import { auth } from "@/src/firebase/config";
import { createJournalEntry } from "@/src/firebase/journal";

type JournalEntryPageProps = {
    selectedDate: Date | null;
    onOpenDatePicker: () => void;
};

export default function JournalEntryPage({
    selectedDate,
    onOpenDatePicker,
    }: JournalEntryPageProps) {
    const [book, setBook] = useState("");
    const [bookDropdownOpen, setBookDropdownOpen] = useState(false);

    const [pagesRead, setPagesRead] = useState("");
    const [isPrivate, setIsPrivate] = useState(true);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [gemsEarned, setGemsEarned] = useState(0);
    const [rewardReason, setRewardReason] = useState("");
    const [showFirstEntrySticker, setShowFirstEntrySticker] = useState(false);

    const gemIcon = require("../assets/images/gem.png");

    const savedBooks = [
        "Fourth Wing",
        "The Hunger Games",
        "Percy Jackson",
        "Pride and Prejudice",
        "The Great Gatsby",
    ];

    function formatDate(date: Date | null) {
        if (!date) return "";
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    async function handleSave() {
        const user = auth.currentUser;

        if (!user) {
        Alert.alert("Error", "You must be logged in.");
        return;
        }

        if (!book.trim()) {
        Alert.alert("Missing info", "Please select or enter a book.");
        return;
        }

        if (!notes.trim()) {
        Alert.alert("Missing info", "Please write something in your notes.");
        return;
        }

        try {
        setSaving(true);

        const result = await createJournalEntry({
            userId: user.uid,
            book,
            pagesRead: Number(pagesRead) || 0,
            date: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
            isPrivate,
            notes,
        });

        setGemsEarned(result.gemsAwarded);
        setRewardReason(result.rewardReason);
        setShowFirstEntrySticker(result.unlockedStickerIds.includes("first_entry"));
        setShowSuccessScreen(true);

        setNotes("");
        setPagesRead("");
        setBook("");
        setBookDropdownOpen(false);
        setIsPrivate(true);
        } catch (error: any) {
        Alert.alert("Error", error.message ?? "Failed to save entry");
        } finally {
        setSaving(false);
        }
    }

    function handleBackToEntryScreen() {
        setShowSuccessScreen(false);
        setGemsEarned(0);
        setRewardReason("");
        setShowFirstEntrySticker(false);
    }

    if (showSuccessScreen) {
        return (
        <View className="flex-1 items-center justify-center px-8 ">
            <Text className="text-center text-[30px] font-bold text-[#472A2A]">
            Entry Saved!
            </Text>

            <View className="mt-6 w-full rounded-[18px] border border-[#9b8277] bg-[#EEDBD3] px-5 py-5">
            <View className=" flex-row items-center justify-center">
            <Text className="text-[24px] font-bold text-[#472A2A]">
                +{gemsEarned}
            </Text>
            <Image
                source={gemIcon}
                resizeMode="contain"
                className="ml-2 h-[24px] w-[24px]"
            />
            </View>

            <Text className="mt-3 text-center text-[14px] leading-6 text-[#5b3b2e]">
                {rewardReason}
            </Text>

            {showFirstEntrySticker && (
                <Text className="mt-4 text-center text-[14px] leading-6 text-pink-500">
                Earned a sticker!
                </Text>
            )}
            </View>

            <Pressable
            onPress={handleBackToEntryScreen}
            className="mt-6 rounded-[14px] border border-[#70925a] bg-[#D7E9C1] px-6 py-3"
            >
            <Text className="text-[18px] font-semibold text-[#472A2A]">
                ← Back
            </Text>
            </Pressable>
        </View>
        );
    }

    return (
        <View className="relative flex-1">
        <Text className="mt-4 text-center text-[29px] font-bold text-[#472A2A]">
            Journal Entry
        </Text>

        <View className="relative mt-6 ml-6 mr-10">
            <View className="flex-row items-center">
            <Text className="w-[60px] text-[15px] text-[#472A2A]">Book:</Text>

            <View className="h-[36px] flex-1 flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#EEDBD3] px-3">
                <TextInput
                value={book}
                onChangeText={setBook}
                onFocus={() => setBookDropdownOpen(true)}
                placeholder="Select or type"
                placeholderTextColor="#8c7569"
                className="flex-1 text-[15px] text-[#472A2A]"
                />

                <Pressable onPress={() => setBookDropdownOpen((prev) => !prev)}>
                <Text className="ml-2 text-[15px] text-[#472A2A]">
                    {bookDropdownOpen ? "▲" : "▼"}
                </Text>
                </Pressable>
            </View>
            </View>

            {bookDropdownOpen && (
            <View className="absolute left-[60px] right-0 top-[42px] z-10 rounded-[8px] border border-[#9b8277] bg-[#EEDBD3]">
                {savedBooks.map((item) => (
                <Pressable
                    key={item}
                    onPress={() => {
                    setBook(item);
                    setBookDropdownOpen(false);
                    Keyboard.dismiss();
                    }}
                    className="border-b border-[#d2c3b9] px-3 py-2"
                >
                    <Text className="text-[14px] text-[#472A2A]">{item}</Text>
                </Pressable>
                ))}
            </View>
            )}
        </View>

        <View className="relative mt-5 ml-6 mr-10">
            <View className="flex-row items-center">
            <Text className="w-[95px] text-[15px] text-[#472A2A]">
                Pages Read:
            </Text>

            <View className="h-[36px] w-[56px] flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#EEDBD3] px-2">
                <TextInput
                value={pagesRead}
                onChangeText={(text) => setPagesRead(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#8c7569"
                className="flex-1 text-center text-[14px] text-[#472A2A]"
                />
            </View>
            </View>
        </View>

        <View className="relative mt-5 ml-6 mr-10">
            <View className="flex-row items-center">
            <Text className="w-[95px] text-[15px] text-[#472A2A]">Date:</Text>

            <Pressable
                onPress={() => {
                Keyboard.dismiss();
                setBookDropdownOpen(false);
                onOpenDatePicker();
                }}
                className="h-[36px] w-[95px] flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#EEDBD3] px-3"
            >
                <Text
                className={`flex-1 pt-2 text-[14px] ${
                    selectedDate ? "text-[#5b3b2e]" : "text-[#8c7569]"
                }`}
                >
                {formatDate(selectedDate)}
                </Text>
                <Text className="ml-2 text-[15px] text-[#472A2A]">▼</Text>
            </Pressable>
            </View>
        </View>

        <View className="mt-5 ml-6 mr-10 flex-row items-center">
            <View className="mr-10 flex-row items-center">
            <Text className="mr-2 text-[15px] text-[#472A2A]">Private:</Text>
            <Pressable
                onPress={() => setIsPrivate(true)}
                className="h-[22px] w-[22px] items-center justify-center rounded-[4px] border border-[#8d7468] bg-[#EEDBD3]"
            >
                {isPrivate ? (
                <Text className="text-[12px] font-bold text-[#472A2A]">✓</Text>
                ) : null}
            </Pressable>
            </View>

            <View className="flex-row items-center">
            <Text className="mr-2 text-[15px] text-[#472A2A]">Public:</Text>
            <Pressable
                onPress={() => setIsPrivate(false)}
                className="h-[22px] w-[22px] items-center justify-center rounded-[4px] border border-[#8d7468] bg-[#EEDBD3]"
            >
                {!isPrivate ? (
                <Text className="text-[12px] font-bold text-[#472A2A]">✓</Text>
                ) : null}
            </Pressable>
            </View>
        </View>

        <View className="relative mt-5 ml-6 mr-10">
            <Text className="mb-2 text-[15px] text-[#472A2A]">Notes:</Text>

            <View className="relative h-[155px] overflow-hidden rounded-[10px] border border-[#9b8277] bg-[#EEDBD3] px-4 py-3">
            <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
                placeholder="Write your thoughts here..."
                placeholderTextColor="#8c7569"
                className="flex-1 text-[15px] text-[#472A2A]"
            />
            </View>
        </View>

        <View className="mt-3 items-center">
            <Pressable
            onPress={handleSave}
            disabled={saving}
            className="rounded-[14px] border border-[#70925a] bg-[#D7E9C1] px-8 py-3"
            style={{ opacity: saving ? 0.7 : 1 }}
            >
            <Text className="text-[18px] font-semibold text-[#472A2A]">
                {saving ? "Saving..." : "Save Entry"}
            </Text>
            </Pressable>
        </View>
        </View>
    );
}