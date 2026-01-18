import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SettingsScreenProps } from '../Navigation';
import { useLaundryStore } from '../store/laundryStore';
import { useCategoryStore } from '../store/categoryStore';

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const records = useLaundryStore((state) => state.records);
  const categories = useCategoryStore((state) => state.categories);

  const handleExportData = () => {
    const data = {
      categories,
      records,
      exportDate: new Date().toISOString(),
    };
    
    // In a real app, you would save this to a file or share it
    Alert.alert(
      'Export Data',
      `Ready to export:\n${records.length} records\n${categories.length} categories\n\nThis feature would save/share the data in a real app.`,
      [{ text: 'OK' }]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete ALL your laundry records and reset categories to defaults. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            // This would require reset functions in stores
            Alert.alert('Info', 'Clear all data functionality would be implemented here.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CustomizeCategories')}
        >
          <Text style={styles.menuItemIcon}>✏️</Text>
          <Text style={styles.menuItemText}>Customize Categories</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
          <Text style={styles.menuItemIcon}>📤</Text>
          <Text style={styles.menuItemText}>Export Data</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleClearAllData}>
          <Text style={styles.menuItemIcon}>🗑️</Text>
          <Text style={styles.menuItemText}>Clear All Data</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Total Records</Text>
          <Text style={styles.infoValue}>{records.length}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Categories</Text>
          <Text style={styles.infoValue}>{categories.length}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f3',
    padding: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#999',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
