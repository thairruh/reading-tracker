import { useState } from "react";
import { Modal, View, Text, Pressable, Image, Dimensions, TouchableWithoutFeedback, Keyboard, } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import JournalEntryPage from "./JournalEntryPage";
import PastEntriesPage, { Entry } from "./PastEntriesPage";
import JournalEntryDetailPage from "./JournalEntryDetailPage";
import EditJournalEntryPage from "./EditJournalEntryPage";

const journalImage = require("../assets/images/Journal-export.png");

// get screen width
const { width } = Dimensions.get("window");

// calculate responsive size
const modalWidth = Math.min(width * 1.0, 400); // max 400px
const aspectRatio = 780 / 400; // your original ratio
const modalHeight = modalWidth * aspectRatio;

type JournalModalProps = {
  visible: boolean;
  onClose: () => void;
};

type JournalTab = "entry" | "past" | "stickers";
type PastView = "list" | "detail" | "edit";

export default function JournalModal({ visible, onClose }: JournalModalProps) {
  const [activeTab, setActiveTab] = useState<JournalTab>("entry");
  const [pastView, setPastView] = useState<PastView>("list");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  // date picker state lives in the modal shell so the overlay can cover the whole journal
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setShowDatePicker(false);
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/40">
          {/* journal container */}
          <View style={{ width: modalWidth, height: modalHeight }} className="relative">
            {/* journal image */}
            <Image
              source={journalImage}
              className="absolute h-full w-full"
              resizeMode="contain"
            />

            {/* overlay content */}
            <View className="absolute left-[35px] right-[40px] top-[120px] bottom-[150px]">
              {/* close button */}
              <Pressable onPress={onClose} className="absolute right-2 top-0 z-20">
                <Text className="text-lg font-bold">X</Text>
              </Pressable>

              {/* right side tabs */}
              <View className="absolute right-[-55px] top-[110px] gap-y-3 z-10">
                {(["entry", "past", "stickers"] as JournalTab[]).map((tab) => {
                  const isActive = activeTab === tab;

                  return (
                    <Pressable
                      key={tab}
                      onPress={() => {
                        setActiveTab(tab);
                        setSelectedEntry(null);
                        setPastView("list");
                      }}
                      className={`h-[48px] w-[84px] items-center justify-center rounded-r-[16px] ${
                        isActive ? "bg-[#e8d8cf]" : "bg-[#d6c3b7]"
                      }`}
                    >
                      <Text className="text-[12px] capitalize text-[#5b3b2e]">
                        {tab}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* tab content */}
              {activeTab === "entry" && (
                <JournalEntryPage
                  selectedDate={selectedDate}
                  onOpenDatePicker={() => setShowDatePicker(true)}
                />
              )}

              {activeTab === "past" && pastView === "list" && (
                <PastEntriesPage
                  onSelectEntry={(entry) => {
                    setSelectedEntry(entry);
                    setPastView("detail");
                  }}
                />
              )}

              {activeTab === "past" && pastView === "detail" && selectedEntry && (
                <JournalEntryDetailPage
                  entry={selectedEntry}
                  onBack={() => {
                    setSelectedEntry(null);
                    setPastView("list");
                  }}
                  onDeleteSuccess={() => {
                    setSelectedEntry(null);
                    setPastView("list");
                  }}
                  onEdit={(entry) => {
                    setSelectedEntry(entry);
                    setSelectedDate(entry.date ? new Date(entry.date) : new Date());
                    setPastView("edit");
                  }}
                />
              )}

              {activeTab === "past" && pastView === "edit" && selectedEntry && (
                <EditJournalEntryPage
                  entry={selectedEntry}
                  selectedDate={selectedDate}
                  onOpenDatePicker={() => setShowDatePicker(true)}
                  onCancel={() => setPastView("detail")}
                  onSave={(updatedEntry) => {
                    setSelectedEntry(updatedEntry);
                    setPastView("detail");
                  }}
                />
              )}

              {activeTab === "stickers" && (
                <Text className="mt-8 text-center text-2xl text-[#5b3b2e]">
                  Stickers Page
                </Text>
              )}
            </View>

            {/* date picker overlay */}
            {showDatePicker && (
              <View className="absolute inset-0 z-50 items-center justify-center bg-black/20">
                <TouchableWithoutFeedback>
                  <View className="w-[350px] rounded-[20px] bg-[#efe7e1] px-4 pb-4 pt-4">
                    <Text className="mb-2 text-center text-[18px] font-semibold text-[#5b3b2e]">
                      Select Date
                    </Text>

                    <DateTimePicker
                      value={selectedDate ?? new Date()}
                      mode="date"
                      display="spinner"
                      themeVariant="light"
                      onChange={(_, date) => {
                        if (date) {
                          setSelectedDate(date);
                        }
                      }}
                      style={{ height: 180 }}
                    />

                    <View className="mt-2 flex-row justify-end gap-x-4">
                      <Pressable onPress={() => setShowDatePicker(false)}>
                        <Text className="text-[16px] text-[#7a5c4d]">Cancel</Text>
                      </Pressable>

                      <Pressable onPress={() => setShowDatePicker(false)}>
                        <Text className="text-[16px] font-semibold text-[#5b3b2e]">
                          Done
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}