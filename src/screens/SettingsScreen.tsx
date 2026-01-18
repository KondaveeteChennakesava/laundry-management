import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { SettingsScreenProps } from '../Navigation';
import { useLaundryStore } from '../store/laundryStore';
import { useCategoryStore } from '../store/categoryStore';
import { useThemeStore } from '../store/themeStore';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const records = useLaundryStore((state) => state.records);
  const categories = useCategoryStore((state) => state.categories);
  const { theme, isDarkMode, toggleTheme } = useThemeStore();
  const clearAllRecords = useLaundryStore((state) => state.clearAllRecords);
  const resetToDefaults = useCategoryStore((state) => state.resetToDefaults);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportData = async () => {
    try {
      setIsImporting(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const importedData = JSON.parse(fileContent);

      // Validate data structure
      if (!importedData.categories || !importedData.records || !Array.isArray(importedData.categories) || !Array.isArray(importedData.records)) {
        throw new Error('Invalid backup file format');
      }

      // Show confirmation with preview
      Alert.alert(
        'Import Data',
        `Found:\n${importedData.records.length} laundry records\n${importedData.categories.length} categories\n\nThis will replace all existing data. Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: () => {
              try {
                // Clear existing data and cancel notifications
                clearAllRecords();
                
                // Batch import categories (preserves IDs)
                const categoryState = useCategoryStore.getState();
                categoryState.importCategories(importedData.categories);
                
                // Batch import records (preserves IDs and status)
                const laundryState = useLaundryStore.getState();
                laundryState.importRecords(importedData.records);
                
                Alert.alert('Success', 'Data imported successfully!\n\nNote: Notifications have been cleared and need to be rescheduled.');
              } catch (error) {
                console.error('Import processing error:', error);
                Alert.alert('Error', 'Failed to process imported data.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import data. Please ensure the file is a valid backup.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const data = {
        categories,
        records,
        exportDate: new Date().toISOString(),
        appVersion: '1.2.0',
      };
      
      const fileName = `laundry-backup-${Date.now()}.json`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      console.log('Exporting to:', fileUri);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
      console.log('File written successfully');
      
      const canShare = await Sharing.isAvailableAsync();
      console.log('Can share:', canShare);
      
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Laundry Data',
          UTI: 'public.json',
        });
      } else {
        Alert.alert('Export Complete', `Data saved to:\n${fileUri}\n\nYou can find this file in your app's cache directory.`);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Error', `Failed to export data: ${error.message || 'Unknown error'}\n\nPlease try again.`);
    } finally {
      setIsExporting(false);
    }
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
            clearAllRecords();
            resetToDefaults();
            Alert.alert('Success', 'All data has been cleared and categories reset to defaults.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
        
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.cardBackground }]}
          onPress={handleExportData}
          disabled={isExporting}
        >
          <Text style={styles.menuItemIcon}>📤</Text>
          <Text style={[styles.menuItemText, { color: theme.primaryText }]}>
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Text>
          <Text style={[styles.menuItemArrow, { color: theme.tertiaryText }]}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.cardBackground }]}
          onPress={handleImportData}
          disabled={isImporting}
        >
          <Text style={styles.menuItemIcon}>📥</Text>
          <Text style={[styles.menuItemText, { color: theme.primaryText }]}>
            {isImporting ? 'Importing...' : 'Import Data'}
          </Text>
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
          <Text style={[styles.infoValue, { color: theme.primaryText }]}>1.2.0</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
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
