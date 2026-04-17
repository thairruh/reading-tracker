import { logout } from "@/src/firebase/auth";
import { auth } from "@/src/firebase/config";
import { router } from "expo-router";
import {
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    updatePassword,
} from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const COLOR = {
  cream:     "#fbf7f6",
  text:      "#5a3e36",
  textLight: "#9b7b72",
  brown:     "#8b6355",
  pink:      "#EEDBD3",
  pinkDark:  "#c97a8a",
  danger:    "#c04040",
  dangerBg:  "#fff5f5",
  white:     "#ffffff",
  gray:      "#d4c4bc",
} as const;

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={s.sectionHeader}>{title}</Text>
);

const RowItem = ({
  label,
  onPress,
  danger = false,
  right,
}: {
  label: string;
  onPress?: () => void;
  danger?: boolean;
  right?: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={onPress ? 0.6 : 1}
    style={[s.row, danger && s.rowDanger]}
  >
    <Text style={[s.rowLabel, danger && s.rowLabelDanger]}>{label}</Text>
    {right && <View style={s.rowRight}>{right}</View>}
  </TouchableOpacity>
);

// ── HELPERS ───────────────────────────────────────────────────────────────────

// Prompt user for their current password to reauthenticate before sensitive ops
function promptReauth(): Promise<string> {
  return new Promise((resolve, reject) => {
    Alert.prompt(
      "Confirm password",
      "Enter your current password to continue",
      [
        { text: "Cancel", style: "cancel", onPress: () => reject(new Error("cancelled")) },
        { text: "Continue", onPress: (pw) => (pw ? resolve(pw) : reject(new Error("empty"))) },
      ],
      "secure-text"
    );
  });
}

async function reauthCurrentUser(currentPassword: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Not logged in");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // ── Account actions ──────────────────────────────────────────────────────

  function handleEditProfile() {
    Alert.alert("Coming soon", "Profile editing will be available soon.");
  }

  async function handleChangePassword() {
    try {
      const currentPw = await promptReauth();
      await reauthCurrentUser(currentPw);

      Alert.prompt(
        "New password",
        "Enter your new password (min 6 characters)",
        async (newPw) => {
          if (!newPw || newPw.length < 6) {
            Alert.alert("Too short", "Password must be at least 6 characters.");
            return;
          }
          try {
            await updatePassword(auth.currentUser!, newPw);
            Alert.alert("Done", "Password updated successfully.");
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Could not update password.");
          }
        },
        "secure-text"
      );
    } catch {
      // user cancelled — do nothing
    }
  }

  async function handleChangeEmail() {
    try {
      const currentPw = await promptReauth();
      await reauthCurrentUser(currentPw);

      Alert.prompt(
        "New email",
        "Enter your new email address",
        async (newEmail) => {
          if (!newEmail?.includes("@")) {
            Alert.alert("Invalid", "Please enter a valid email address.");
            return;
          }
          try {
            await updateEmail(auth.currentUser!, newEmail);
            Alert.alert("Done", "Email updated successfully.");
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Could not update email.");
          }
        },
        "plain-text"
      );
    } catch {
      // user cancelled
    }
  }

  async function handleLogOut() {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/signup-login");
          } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Could not log out.");
          }
        },
      },
    ]);
  }

  async function handleDeleteAccount() {
    Alert.alert(
      "Delete account",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const currentPw = await promptReauth();
              await reauthCurrentUser(currentPw);
              await deleteUser(auth.currentUser!);
              router.replace("/signup-login");
            } catch (e: any) {
              if ((e as Error).message !== "cancelled") {
                Alert.alert("Error", e?.message ?? "Could not delete account.");
              }
            }
          },
        },
      ]
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── ACCOUNT ── */}
        <SectionHeader title="Account" />
        <View style={s.group}>
          <RowItem label="Edit Profile"     onPress={handleEditProfile} />
          <View style={s.divider} />
          <RowItem label="Change Password"  onPress={handleChangePassword} />
          <View style={s.divider} />
          <RowItem label="Change Email"     onPress={handleChangeEmail} />
        </View>

        {/* ── NOTIFICATIONS ── */}
        <SectionHeader title="Notifications" />
        <View style={s.group}>
          <RowItem
            label="Push notifications"
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLOR.gray, true: COLOR.pinkDark }}
                thumbColor={COLOR.white}
              />
            }
          />
        </View>

        {/* ── SOUND ── */}
        <SectionHeader title="Sound" />
        <View style={s.group}>
          <RowItem
            label="Music"
            right={
              <Switch
                value={musicEnabled}
                onValueChange={setMusicEnabled}
                trackColor={{ false: COLOR.gray, true: COLOR.pinkDark }}
                thumbColor={COLOR.white}
              />
            }
          />
        </View>

        {/* ── DANGER ZONE ── */}
        <View style={s.dangerGroup}>
          <RowItem label="Log Out"        onPress={handleLogOut}        danger />
          <View style={s.divider} />
          <RowItem label="Delete Account" onPress={handleDeleteAccount} danger />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLOR.cream,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    padding: 4,
  },
  backArrow: {
    fontSize: 22,
    color: COLOR.brown,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLOR.text,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: COLOR.textLight,
    marginTop: 24,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  group: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.pink,
    overflow: "hidden",
  },
  dangerGroup: {
    marginTop: 32,
    backgroundColor: COLOR.dangerBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0a0a0",
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: COLOR.pink,
    marginLeft: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLOR.white,
  },
  rowDanger: {
    backgroundColor: COLOR.dangerBg,
  },
  rowLabel: {
    fontSize: 15,
    color: COLOR.text,
  },
  rowLabelDanger: {
    color: COLOR.danger,
    fontWeight: "600",
  },
  rowRight: {
    alignItems: "center",
    justifyContent: "center",
  },
});