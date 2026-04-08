import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-white p-5">
        <Text className="text-2xl font-bold">Page Not Found</Text>
        <Link href="/" className="mt-4 py-2 text-blue-500">
          Go to Home Screen!
        </Link>
      </View>
    </>
  );
}
