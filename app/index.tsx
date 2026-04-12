import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { User } from "firebase/auth";
import { subscribeToAuth } from "@/src/firebase/auth";

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-black">Loading...</Text>
      </View>
    );
  }

  if (currentUser) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth-test" />;
}