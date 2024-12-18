import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Color'
import { NativeBaseProvider } from 'native-base';

export default function TabLayout() {
  return (
    <NativeBaseProvider>
        <Tabs screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.PRIMARY
        }}>
          <Tabs.Screen name='home'
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
            }} />
          <Tabs.Screen name='explore'
            options={{
              tabBarLabel: 'Explore',
              tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />
            }} />
          <Tabs.Screen name='cart'
            options={{
              tabBarLabel: 'Cart',
              tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />
            }} />
          <Tabs.Screen name='product'
            options={{
              tabBarLabel: 'Product',
              tabBarIcon: ({ color }) => <Ionicons name="shirt-outline" size={24} color={color} />
            }} />

        </Tabs>
    </NativeBaseProvider>
  )
}