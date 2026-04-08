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
} from "react-native";

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

interface ScreenProps {
  go: (screen: ScreenName) => void;
}

const GemPill = ({ gems = 100, streaks = 5 }: { gems?: number; streaks?: number }) => (
  <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
    <View style={shared.pill}>
      <Text style={shared.pillTextPink}>🔥 {streaks}</Text>
    </View>
    <View style={shared.pill}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 3, overflow: "visible" }}>
        <Text style={{ fontSize: 9, color: COLOR.black, fontWeight: "700" }}>{u.pts}</Text>
        <Image source={require("../../assets/images/diamond.png")} style={{ width: 14, height: 14 }} />
      </View>
    </View>
  </View>
);

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={{ padding: 4 }}>
    <Text style={{ fontSize: 20, color: COLOR.brown }}>←</Text>
  </TouchableOpacity>
);

const shared = StyleSheet.create({
  pill: {
    backgroundColor: COLOR.pinkLight,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  pillTextPink: {
    fontSize: 11,
    fontWeight: "700",
    color: COLOR.pinkDark,
  },
  pillTextBrown: {
    fontSize: 11,
    fontWeight: "700",
    color: COLOR.brown,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
  },
  topBarTitle: {
    fontWeight: "900",
    fontSize: 16,
    color: COLOR.brown,
  },
  inputContainer: {
    backgroundColor: COLOR.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLOR.pink,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLOR.text,
    padding: 0,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 14,
    color: COLOR.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.pink,
    marginLeft: 32,
  },
});

// SIGN UP / LOGIN
function SignUpScreen({ go }: ScreenProps) {
  const [mode, setMode] = useState<"signup" | "login">("signup");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.cream }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 52, marginBottom: 25 }}>📚</Text>
        <Text style={{ color: COLOR.pinkDark, fontSize: 26, fontWeight: "900", marginBottom: 24, letterSpacing: 1 }}>
          {mode === "signup" ? "Sign Up" : "Log In"}
        </Text>

        <View style={{ width: "100%", gap: 12 }}>
          {/* Email */}
          <View style={shared.inputContainer}>
            <Text>✉️</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor={COLOR.textLight}
              style={shared.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Username*/}
          {mode === "signup" && (
            <View style={shared.inputContainer}>
              <Text>👤</Text>
              <TextInput
                placeholder="Username"
                placeholderTextColor={COLOR.textLight}
                style={shared.input}
                autoCapitalize="none"
              />
            </View>
          )}

          {/* Password */}
          <View style={shared.inputContainer}>
            <Text>🔒</Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor={COLOR.textLight}
              style={shared.input}
              secureTextEntry
            />
          </View>

          {/* Submit button */}
          <TouchableOpacity
            onPress={() => go("leaderboard")}
            style={[shared.button, { backgroundColor: COLOR.pinkMid, marginTop: 8 }]}
          >
            <Text style={shared.buttonText}>
              {mode === "signup" ? "Create account" : "Log in"}
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

// LEADERBOARD
interface LeaderEntry {
  name: string;
  pts: number;
  rank: number;
}

function LeaderboardScreen({ go }: ScreenProps) {
  const [tab, setTab] = useState<"Today" | "This Week" | "Streaks">("Today");

  const top3: LeaderEntry[] = [
    { name: "3underscore3", pts: 213, rank: 1 },
    { name: "3underscore3", pts: 156, rank: 2 },
    { name: "3underscore3", pts: 102, rank: 3 },
  ];

  const rest: LeaderEntry[] = [
    { name: "Username", pts: 100, rank: 4 },
    { name: "Username", pts: 87,  rank: 5 },
    { name: "Username", pts: 67,  rank: 6 },
    { name: "Username", pts: 48,  rank: 7 },
    { name: "Username", pts: 31,  rank: 8 },
    { name: "Username", pts: 22,  rank: 9 },
    { name: "Username", pts: 18,  rank: 10 },
  ];

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const medals = ["🥈", "🥇", "🥉"];
  const podiumHeights = [100, 120, 90];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.cream }}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View style={shared.topBar}>
        <BackButton onPress={() => go("signup")} />
        <Text style={shared.topBarTitle}>Leaderboard</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Tab row */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 24, paddingHorizontal: 16, paddingBottom: 12 }}>
        {(["Today", "This Week", "Streaks"] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={{ paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: tab === t ? COLOR.pinkDark : "transparent" }}>
            <Text style={{ fontWeight: "700", fontSize: 12, color: tab === t ? COLOR.pinkDark : COLOR.gray }}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Podium */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 16, paddingHorizontal: 16, paddingBottom: 0 }}>
        {podiumOrder.map((u, i) => (
          <View key={i} style={{ alignItems: "center", gap: 6, overflow: "visible" }}>
            <Text style={{ fontSize: 22 }}>{medals[i]}</Text>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLOR.pink, borderWidth: 2, borderColor: COLOR.pink, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </View>
            <Text style={{ fontSize: 9, fontWeight: "700", color: COLOR.text, maxWidth: 56, textAlign: "center", lineHeight: 14 }}>
              {u.name}
            </Text>
            <View style={{ width: 80, height: podiumHeights[i], backgroundColor: COLOR.pink, borderRadius: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: "center", justifyContent: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Text style={{ fontSize: 9, color: COLOR.black, fontWeight: "700" }}>{u.pts}</Text>
                <Image source={require("../../assets/images/diamond.png")} style={{ width: 12, height: 12 }} />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Ranked list */}
      <View style={{ flex: 1, marginHorizontal: 16, borderWidth: 1.5, borderColor: COLOR.pink, borderRadius: 20, overflow: "hidden", backgroundColor: COLOR.cream }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
          {rest.map((u, i) => (
            <View key={i}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 }}>
                <Text style={{ fontWeight: "900", color: COLOR.textLight, fontSize: 14, minWidth: 20 }}>{u.rank}</Text>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: COLOR.pinkLight, alignItems: "center", justifyContent: "center" }}>
                  <Text>👤</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 13, color: COLOR.text }}>{u.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3, overflow: "visible" }}>
                    <Text style={{ fontSize: 9, color: COLOR.black, fontWeight: "700" }}>{u.pts}</Text>
                    <Image source={require("../../assets/images/diamond.png")} style={{ width: 14, height: 14 }} />
                  </View>
              </View>
              {i < rest.length - 1 && <View style={shared.divider} />}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom padding */}
      <View style={{ height: 24 }} />
    </SafeAreaView>
  );
}



const SCREENS: Record<ScreenName, (props: ScreenProps) => JSX.Element> = {
  signup:      SignUpScreen,
  leaderboard: LeaderboardScreen,
};

export default function HomeScreen() {
  const [screen, setScreen] = useState<ScreenName>("signup");
  const Screen = SCREENS[screen];
  return (
    <View style={{ flex: 1, backgroundColor: COLOR.cream }}>
      <Screen go={setScreen} />
    </View>
  );
}