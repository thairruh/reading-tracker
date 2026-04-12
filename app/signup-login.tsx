import { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { login, register } from "@/src/firebase/auth";

const COLOR = {
  white:     "#ffffff",
  black:     "#000000",
  textLight: "#9b7b72",
  text:      "#5a3e36",
  cream:     "#fbf7f6",
  pink:      "#EEDBD3",
  pinkLight: "#fae8ec",
  pinkMid:   "#f4b7b7",
  pinkDark:  "#c97a8a",
  gray:      "#d4c4bc",
  brown:     "#8b6355",
} as const;

type ScreenName = "signup" | "leaderboard";


// SIGN UP / LOGIN
export default function AuthScreen() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "signup") {
        await register(email.trim(), password);
        // optional: save username later
      } else {
        await login(email.trim(), password);
      }

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Auth error", error?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.cream }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 52, marginBottom: 25 }}>📚</Text>
        <Text style={{ color: COLOR.pinkDark, fontSize: 26, fontWeight: "900", marginBottom: 24, letterSpacing: 1 }}>
          {mode === "signup" ? "Sign Up" : "Log In"}
        </Text>

        <View style={{ width: "100%", gap: 12 }}>
          {/* Email */}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={COLOR.textLight}
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: COLOR.pink,
              padding: 12,
              fontSize: 13,
              color: COLOR.text,
            }}
            autoCapitalize="none"
          />

          {/* Username*/}
          {mode === "signup" && (
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor={COLOR.textLight}
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: COLOR.pink,
                padding: 12,
                fontSize: 13,
                color: COLOR.text,
              }}
            />
          )}

          {/* Password */}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={COLOR.textLight}
            secureTextEntry
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: COLOR.pink,
              padding: 12,
              fontSize: 13,
              color: COLOR.text,
            }}
          />

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: COLOR.pinkMid,
              borderRadius: 20,
              paddingVertical: 13,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              {loading
                ? "Please wait..."
                : mode === "signup"
                ? "Create account"
                : "Log in"}
            </Text>
          </TouchableOpacity>


          {/* Toggle mode */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: COLOR.textLight }}>
              {mode === "signup" ? "Already have an account? " : "No account? "}
            </Text>
            <TouchableOpacity onPress={() => setMode(mode === "signup" ? "login" : "signup")}>
              <Text style={{ fontSize: 12, color: COLOR.pinkDark, fontWeight: "700" }}>
                {mode === "signup" ? "Log in" : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}