import React from 'react';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf')
  });

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="productDetail/[productId]" />
      </Stack>
    </SafeAreaProvider>
  );
}
