import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeScreenProps } from '../Navigation';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Laundry Tracker</Text>
      <Text style={styles.subtitle}>Keep track of your hostel laundry</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NewEntry')}
        >
          <Text style={styles.buttonIcon}>➕</Text>
          <Text style={styles.buttonText}>New Entry</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonIcon}>📋</Text>
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.settingsText}>⚙️ Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: '#bbdefb',
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
    color: '#37474f',
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginTop: 40,
    padding: 15,
  },
  settingsText: {
    fontSize: 16,
    color: '#78909c',
    fontWeight: '600',
  },
});
