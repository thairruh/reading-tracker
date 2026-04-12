import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Pressable, } from "react-native";
import { updateJournalEntry } from "@/src/firebase/journal";
import type { Entry } from "./PastEntriesPage";

type Props = {
  entry: Entry;
  onCancel: () => void;
  onSave: (updatedEntry: Entry) => void;
  selectedDate: Date | null;
  onOpenDatePicker: () => void;
};

function formatDate(date: Date | null) {
  if (!date) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export default function EditJournalEntryPage({
  entry,
  onCancel,
  onSave,
  selectedDate,
  onOpenDatePicker,
}: Props) {
  const [book, setBook] = useState(entry.book);
  const [notes, setNotes] = useState(entry.notes);
  const [pagesRead, setPagesRead] = useState(String(entry.pagesRead));
  const [isPrivate, setIsPrivate] = useState(entry.isPrivate);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!book.trim()) {
      Alert.alert("Missing title", "Please enter a book title.");
      return;
    }

    if (!notes.trim()) {
      Alert.alert("Missing entry", "Please write something in your journal entry.");
      return;
    }

    const parsedPages = Number(pagesRead);
    if (Number.isNaN(parsedPages) || parsedPages < 0) {
      Alert.alert("Invalid pages read", "Please enter a valid number.");
      return;
    }

    const finalDate = selectedDate
      ? selectedDate.toISOString()
      : entry.date;

    try {
      setLoading(true);

      await updateJournalEntry(entry.id, {
        book: book.trim(),
        notes: notes.trim(),
        pagesRead: parsedPages,
        date: finalDate,
        isPrivate,
      });

      onSave({
        ...entry,
        book: book.trim(),
        notes: notes.trim(),
        pagesRead: parsedPages,
        date: finalDate,
        isPrivate,
      });
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Failed to update entry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="relative flex-1">
      <Text className="mt-4 text-center text-[29px] font-bold text-[#472A2A]">
        Edit Entry
      </Text>

      <View className="mt-6 ml-6 mr-10">
        <View className="flex-row items-center">
          <Text className="w-[60px] text-[15px] text-[#472A2A]">Book:</Text>

          <View className="h-[36px] flex-1 flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#EEDBD3] px-3">
            <TextInput
              value={book}
              onChangeText={setBook}
              placeholder="Book title"
              placeholderTextColor="#8c7569"
              className="flex-1 text-[15px] text-[#472A2A]"
            />
          </View>
        </View>
      </View>

      <View className="mt-5 ml-6 mr-10">
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

      <View className="mt-5 ml-6 mr-10">
        <View className="flex-row items-center">
          <Text className="w-[95px] text-[15px] text-[#472A2A]">Date:</Text>

          <Pressable
            onPress={onOpenDatePicker}
            className="h-[36px] w-[95px] flex-row items-center rounded-[8px] border border-[#9b8277] bg-[#EEDBD3] px-3"
          >
            <Text
              className={`flex-1 text-[14px] pt-2 ${
                selectedDate ? "text-[#472A2A]" : "text-[#8c7569]"
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

      <View className="mt-5 ml-6 mr-10 flex-1">
        <Text className="mb-2 text-[15px] text-[#472A2A]">Notes:</Text>

        <View className="min-h-[155px] flex-1 rounded-[10px] border border-[#9b8277] bg-[#EEDBD3] px-4 py-3 overflow-hidden">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              placeholder="Write your thoughts here..."
              placeholderTextColor="#8c7569"
              className="flex-1 text-[15px] text-[#472A2A]"
            />
          </ScrollView>
        </View>
      </View>

      <View className="mt-4 mb-2 flex-row items-center justify-between px-3">
        <TouchableOpacity onPress={onCancel}>
          <Text className="text-[20px] text-[#5b3b2e]">←</Text>
        </TouchableOpacity>

        <Pressable
          onPress={handleSave}
          disabled={loading}
          className="rounded-[14px] border border-[#70925a] bg-[#D7E9C1] px-5 py-3"
        >
          <Text className="text-[15px] font-semibold text-[#472A2A]">
            {loading ? "Saving..." : "Save Entry"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}