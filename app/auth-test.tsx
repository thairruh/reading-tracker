import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { User } from "firebase/auth";
import { login, register, subscribeToAuth } from "@/src/firebase/auth";

export default function AuthTestScreen() {
    const [email, setEmail] = useState("testuser1@example.com");
    const [password, setPassword] = useState("password123");
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToAuth((user) => {
        setCurrentUser(user);

        if (user) {
            router.replace("/(tabs)");
        }
        });

        return unsubscribe;
    }, []);

    async function handleRegister() {
        try {
        const user = await register(email, password);
        Alert.alert("Registered", user.email ?? user.uid);
        router.replace("/(tabs)");
        } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
            Alert.alert("Account exists", "This email already exists. Try logging in.");
            return;
        }

        Alert.alert("Register error", error.message ?? "Something went wrong");
        }
    }

    async function handleLogin() {
        try {
        const user = await login(email, password);
        Alert.alert("Logged in", user.email ?? user.uid);
        router.replace("/(tabs)");
        } catch (error: any) {
        Alert.alert("Login error", error.message ?? "Something went wrong");
        }
    }

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-6 text-3xl font-bold text-black">Welcome</Text>

        <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9ca3af"
            className="mb-3 w-full max-w-[320px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-black"
        />

        <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#9ca3af"
            className="mb-5 w-full max-w-[320px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-black"
        />

        <Pressable
            onPress={handleRegister}
            className="mb-3 w-full max-w-[320px] items-center rounded-xl bg-pink-400 py-3.5"
        >
            <Text className="font-semibold text-white">Register</Text>
        </Pressable>

        <Pressable
            onPress={handleLogin}
            className="w-full max-w-[320px] items-center rounded-xl bg-blue-500 py-3.5"
        >
            <Text className="font-semibold text-white">Login</Text>
        </Pressable>

        <Text className="mt-6 text-center text-sm text-gray-700">
            Current user: {currentUser ? currentUser.email : "No user signed in"}
        </Text>
        </View>
    );
}