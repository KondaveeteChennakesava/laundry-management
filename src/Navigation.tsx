import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useThemeStore } from './store/themeStore';

// Import screens
import HomeScreen from './screens/HomeScreen';
import NewEntryScreen from './screens/NewEntryScreen';
import HistoryScreen from './screens/HistoryScreen';
import DetailScreen from './screens/DetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import CustomizeCategoriesScreen from './screens/CustomizeCategoriesScreen';

export type RootStackParamList = {
  Home: undefined;
  NewEntry: undefined;
  History: undefined;
  Detail: { recordId: string };
  Settings: undefined;
  CustomizeCategories: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type NewEntryScreenProps = NativeStackScreenProps<RootStackParamList, 'NewEntry'>;
export type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;
export type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;
export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
export type CustomizeCategoriesScreenProps = NativeStackScreenProps<RootStackParamList, 'CustomizeCategories'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const theme = useThemeStore((state) => state.theme);
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Laundry Tracker' }}
        />
        <Stack.Screen 
          name="NewEntry" 
          component={NewEntryScreen}
          options={{ title: 'New Laundry Entry' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Laundry History' }}
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen}
          options={{ title: 'Entry Details' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen 
          name="CustomizeCategories" 
          component={CustomizeCategoriesScreen}
          options={{ title: 'Customize Categories' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
