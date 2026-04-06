import { useState } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    Keyboard,
    Button,
    } from "react-native";

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

    // hardcoded saved books for dropdown - will be replaced with dynamic data later
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
        const year = String(date.getFullYear()).slice(-2);
        return `${month}/${day}/${year}`;
    }

    return (
        <View className="relative flex-1">
        <Text className="mt-4 text-[29px] font-bold text-[#5b3b2e] text-center">
            Journal Entry
        </Text>

        {/* book input with dropdown */}
        <View className="relative mt-6 ml-6 mr-10">
            <View className="flex-row items-center">
            <Text className="w-[60px] text-[15px] text-[#5b3b2e]">Book:</Text>

            <View className="h-[36px] flex-1 flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#ddd1c8] px-3">
                <TextInput
                value={book}
                onChangeText={setBook}
                onFocus={() => setBookDropdownOpen(true)}
                placeholder="Select or type"
                placeholderTextColor="#8c7569"
                className="flex-1 text-[15px] text-[#5b3b2e]"
                />

                <Pressable onPress={() => setBookDropdownOpen((prev) => !prev)}>
                <Text className="ml-2 text-[15px] text-[#5b3b2e]">
                    {bookDropdownOpen ? "▲" : "▼"}
                </Text>
                </Pressable>
            </View>
            </View>

            {bookDropdownOpen && (
            <View className="absolute left-[60px] right-0 top-[42px] z-10 rounded-[8px] border border-[#9b8277] bg-[#efe7e1]">
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
                    <Text className="text-[14px] text-[#5b3b2e]">{item}</Text>
                </Pressable>
                ))}
            </View>
            )}
        </View>

        {/* pages input */}
        <View className="relative mt-5 ml-6 mr-10">
            <View className="flex-row items-center">
            <Text className="w-[95px] text-[15px] text-[#5b3b2e]">
                Pages Read:
            </Text>

            <View className="h-[36px] w-[56px] flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#ddd1c8] px-2">
                <TextInput
                value={pagesRead}
                onChangeText={(text) => setPagesRead(text.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#8c7569"
                className="flex-1 text-[14px] text-[#5b3b2e] text-center"
                />
            </View>
            </View>
        </View>

        {/* date picker button */}
        <View className="relative mt-5 ml-6 mr-10">
            <View className="flex-row items-center">
            <Text className="w-[95px] text-[15px] text-[#5b3b2e]">Date:</Text>

            <Pressable
                onPress={() => {
                Keyboard.dismiss();
                setBookDropdownOpen(false);
                onOpenDatePicker();
                }}
                className="h-[36px] w-[95px] flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#ddd1c8] px-3"
            >
                <Text
                className={`flex-1 text-[14px] pt-2 ${
                    selectedDate ? "text-[#5b3b2e]" : "text-[#8c7569]"
                }`}
                >
                {formatDate(selectedDate)}
                </Text>
                <Text className="ml-2 text-[15px] text-[#5b3b2e]">▼</Text>
            </Pressable>
            </View>
        </View>

        {/* privacy checkboxes */}
        <View className="mt-5 ml-6 mr-10 flex-row items-center">
            <View className="mr-10 flex-row items-center">
            <Text className="mr-2 text-[15px] text-[#5b3b2e]">Private:</Text>
            <Pressable
                onPress={() => setIsPrivate(true)}
                className="h-[22px] w-[22px] items-center justify-center rounded-[4px] border border-[#8d7468] bg-[#efe7e1]"
            >
                {isPrivate ? (
                <Text className="text-[12px] font-bold text-[#5b3b2e]">✓</Text>
                ) : null}
            </Pressable>
            </View>

            <View className="flex-row items-center">
            <Text className="mr-2 text-[15px] text-[#5b3b2e]">Public:</Text>
            <Pressable
                onPress={() => setIsPrivate(false)}
                className="h-[22px] w-[22px] items-center justify-center rounded-[4px] border border-[#8d7468] bg-[#efe7e1]"
            >
                {!isPrivate ? (
                <Text className="text-[12px] font-bold text-[#5b3b2e]">✓</Text>
                ) : null}
            </Pressable>
            </View>
        </View>

        {/* notes input */}
        <View className="relative mt-5 ml-6 mr-10 ">
            <Text className="mb-2 text-[15px] text-[#5b3b2e]">Notes:</Text>

            <View className="relative h-[155px] rounded-[10px] border border-[#9b8277] bg-[#ddd1c8] px-4 py-3 overflow-hidden">
                <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
                placeholder="Write your thoughts here..."
                placeholderTextColor="#8c7569"
                className="flex-1 text-[15px]  text-[#5b3b2e]"
                />

            </View>
        </View>

        <View className="mt-3 items-center">
        <Pressable className="rounded-[14px] border border-[#70925a] bg-[#cfe0b7] px-8 py-3">
            <Text className="text-[18px] font-semibold text-[#4d362b]">
            Save Entry
            </Text>
        </Pressable>
        </View>  

    </View>

    );
}