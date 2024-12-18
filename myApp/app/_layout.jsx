import React from 'react';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { AppProvider } from '../context/AppContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf')
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="productdetail/[productid]"
            options={{
              presentation: 'card',
              headerShown: false
            }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}