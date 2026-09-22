import React from 'react';
import { Tabs } from 'expo-router';
import { House, BookOpen, CalendarDays, ShoppingCart } from 'lucide-react-native';
import { colors, layout } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1.4,
          borderTopColor: colors.line,
          height: layout.tabBarHeight,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 5,
          paddingHorizontal: 6,
          paddingTop: 2,
        },
        tabBarActiveBackgroundColor: colors.terracottaTint,
        tabBarLabelStyle: { fontFamily: 'WorkSans_600SemiBold', fontSize: 10.5, marginBottom: 2 },
      }}
    >
      <Tabs.Screen
        name="pantry"
        options={{ title: 'Pantry', tabBarIcon: ({ color }) => <House size={21} color={color} strokeWidth={1.9} /> }}
      />
      <Tabs.Screen
        name="recipes"
        options={{ title: 'Recipes', tabBarIcon: ({ color }) => <BookOpen size={21} color={color} strokeWidth={1.9} /> }}
      />
      <Tabs.Screen
        name="planner"
        options={{ title: 'Planner', tabBarIcon: ({ color }) => <CalendarDays size={21} color={color} strokeWidth={1.9} /> }}
      />
      <Tabs.Screen
        name="list"
        options={{ title: 'List', tabBarIcon: ({ color }) => <ShoppingCart size={21} color={color} strokeWidth={1.9} /> }}
      />
    </Tabs>
  );
}