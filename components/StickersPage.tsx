import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { auth } from "@/src/firebase/config";
import { getUserDocument } from "@/src/firebase/users";
import { STICKERS } from "@/src/data/stickers";

type UserData = {
    unlockedStickers?: Record<string, boolean>;
    };

    export default function StickersPage() {
    const [unlockedStickers, setUnlockedStickers] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadStickers() {
        try {
            setLoading(true);
            setErrorMessage("");

            const user = auth.currentUser;

            if (!user) {
            setErrorMessage("You must be logged in.");
            return;
            }

            const userData = (await getUserDocument(user.uid)) as UserData | null;
            setUnlockedStickers(userData?.unlockedStickers ?? {});
        } catch (error: any) {
            setErrorMessage(error?.message ?? "Failed to load stickers.");
        } finally {
            setLoading(false);
        }
        }

        loadStickers();
    }, []);

    return (
        <View className="flex-1 px-6 pt-4">
        <Text className="mb-2 text-center text-[29px] font-bold text-[#472A2A]">
            Stickers
        </Text>

        <Text className="mb-5 text-center text-[13px] text-[#7a5c4d]">
            Unlock stickers by completing milestones!
        </Text>

        {loading ? (
            <View className="flex-1 items-center justify-center">
            <Text className="text-[15px] text-[#5b3b2e]">Loading stickers...</Text>
            </View>
        ) : errorMessage ? (
            <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-[15px] text-red-600">
                {errorMessage}
            </Text>
            </View>
        ) : (
            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
            >
            <View className="flex-row flex-wrap justify-between ">
                {STICKERS.map((sticker) => {
                const isUnlocked = !!unlockedStickers[sticker.id];

                return (
                    <View
                    key={sticker.id}
                    className={`mb-4 w-[48%] aspect-square rounded-[16px] border px-3 py-4  ${
                        isUnlocked
                        ? "border-[#9b8277] bg-[#EEDBD3]"
                        : "border-[#9b8277] bg-[#f2e8e3]"
                    }`}
                    style={{ opacity: isUnlocked ? 1 : 0.5 }}
                    >
                    {!isUnlocked && (
                    <View className="absolute right-2 top-2 z-10 h-[22px] w-[22px] items-center justify-center rounded-full ">
                        <Image source={require("../assets/images/lock.png")} className="h-[12px] w-[12px]" />
                    </View>
                    )}
                    <View className="flex-1 items-center justify-center">
                        <Image
                        source={sticker.image}
                        resizeMode="contain"
                        className={`mb-2 h-[60px] w-[60px] ${isUnlocked ? "" : "grayscale"}`}
                        />

                        <Text className="text-center text-[13px] font-semibold text-[#472A2A]">
                        {sticker.name}
                        </Text>

                        <Text className="mt-1 text-center text-[10px] text-[#6e5448]">
                        {sticker.description}
                        </Text>
                    </View>
                    </View>
                );
                })}
            </View>
            </ScrollView>
        )}
        </View>
    );
}