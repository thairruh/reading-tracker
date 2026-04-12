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
import { router } from "expo-router";

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


// LEADERBOARD
interface LeaderEntry {
  name: string;
  pts: number;
  rank: number;
}

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


export default function LeaderboardScreen() {
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
        <BackButton onPress={() => router.replace("/(tabs)")} />
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
          <View key={i} style={{ alignItems: "center", gap: 6}}>
            <Text style={{ fontSize: 22 }}>{medals[i]}</Text>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLOR.pink, borderWidth: 2, borderColor: COLOR.pink, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </View>
            <Text style={{ fontSize: 9, fontWeight: "700", color: COLOR.text, maxWidth: 56, textAlign: "center", lineHeight: 14 }}>
              {u.name}
            </Text>
            <View style={{ width: 80, height: podiumHeights[i], backgroundColor: COLOR.pink, borderRadius: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: "center", justifyContent: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8 }}>
                <Text style={{ fontSize: 9, color: COLOR.black, fontWeight: "700" }}>{u.pts}</Text>
                <Image source={require("../assets/images/gem.png")} style={{ width: 12, height: 12 }} />
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
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3, paddingRight: 6 }}>
                    <Text style={{ fontSize: 9, color: COLOR.black, fontWeight: "700" }}>{u.pts}</Text>
                    <Image source={require("../assets/images/gem.png")} style={{ width: 14, height: 14 }} />
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