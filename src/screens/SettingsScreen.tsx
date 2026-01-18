import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { SettingsScreenProps } from '../Navigation';
import { useLaundryStore } from '../store/laundryStore';
import { useCategoryStore } from '../store/categoryStore';
import { useThemeStore } from '../store/themeStore';

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const records = useLaundryStore((state) => state.records);
  const categories = useCategoryStore((state) => state.categories);
  const { theme, isDarkMode, toggleTheme } = useThemeStore();

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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Appearance</Text>
        
        <View style={[styles.menuItem, { backgroundColor: theme.cardBackground }]}>
          <Text style={styles.menuItemIcon}>🌙</Text>
          <Text style={[styles.menuItemText, { color: theme.primaryText }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#d0d0d0', true: '#64b5f6' }}
            thumbColor={isDarkMode ? '#1976d2' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Categories</Text>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate('CustomizeCategories')}
        >
          <Text style={styles.menuItemIcon}>✏️</Text>
          <Text style={[styles.menuItemText, { color: theme.primaryText }]}>Customize Categories</Text>
          <Text style={[styles.menuItemArrow, { color: theme.tertiaryText }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Data</Text>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.cardBackground }]} onPress={handleExportData}>
          <Text style={styles.menuItemIcon}>📤</Text>
          <Text style={[styles.menuItemText, { color: theme.primaryText }]}>Export Data</Text>
          <Text style={[styles.menuItemArrow, { color: theme.tertiaryText }]}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.cardBackground }]} onPress={handleClearAllData}>
          <Text style={styles.menuItemIcon}>🗑️</Text>
          <Text style={[styles.menuItemText, { color: theme.primaryText }]}>Clear All Data</Text>
          <Text style={[styles.menuItemArrow, { color: theme.tertiaryText }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>About</Text>
        <View style={[styles.infoItem, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Version</Text>
          <Text style={[styles.infoValue, { color: theme.primaryText }]}>1.1.0</Text>
        </View>
        <View style={[styles.infoItem, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Total Records</Text>
          <Text style={[styles.infoValue, { color: theme.primaryText }]}>{records.length}</Text>
        </View>
        <View style={[styles.infoItem, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Categories</Text>
          <Text style={[styles.infoValue, { color: theme.primaryText }]}>{categories.length}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
