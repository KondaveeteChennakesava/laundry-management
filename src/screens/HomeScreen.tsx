import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeScreenProps } from '../Navigation';
import { useThemeStore } from '../store/themeStore';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useThemeStore((state) => state.theme);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
      <Text style={[styles.title, { color: theme.primaryText }]}>Welcome to Laundry Tracker</Text>
      <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Keep track of your hostel laundry</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primaryButton }]}
          onPress={() => navigation.navigate('NewEntry')}
        >
          <Text style={styles.buttonIcon}>➕</Text>
          <Text style={[styles.buttonText, { color: theme.primaryButtonText }]}>New Entry</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primaryButton }]}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonIcon}>📋</Text>
          <Text style={[styles.buttonText, { color: theme.primaryButtonText }]}>History</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={[styles.settingsText, { color: theme.accentLight }]}>⚙️ Settings</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginTop: 40,
    padding: 15,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
