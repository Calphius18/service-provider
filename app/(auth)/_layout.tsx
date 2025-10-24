// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
