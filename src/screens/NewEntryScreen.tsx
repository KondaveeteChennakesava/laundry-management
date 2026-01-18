import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NewEntryScreenProps } from '../Navigation';
import { useCategoryStore } from '../store/categoryStore';
import { useLaundryStore } from '../store/laundryStore';
import { LaundryItem } from '../types';
import { registerForPushNotificationsAsync, schedulePickupNotification, schedulePickupNotificationAtTime } from '../utils/notifications';

export default function NewEntryScreen({ navigation }: NewEntryScreenProps) {
  const categories = useCategoryStore((state) => state.categories);
  const addRecord = useLaundryStore((state) => state.addRecord);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [pickupType, setPickupType] = useState<'minutes' | 'time'>('minutes');
  const [pickupMinutes, setPickupMinutes] = useState('60');
  const [pickupDate, setPickupDate] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours from now
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleIncrement = (categoryId: string) => {
    setItemCounts((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 0) + 1,
    }));
  };

  const handleDecrement = (categoryId: string) => {
    setItemCounts((prev) => ({
      ...prev,
      [categoryId]: Math.max(0, (prev[categoryId] || 0) - 1),
    }));
  };

  const handleSave = async () => {
    const items: LaundryItem[] = categories
      .filter((cat) => itemCounts[cat.id] > 0)
      .map((cat) => ({
        categoryId: cat.id,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        quantity: itemCounts[cat.id],
      }));

    if (items.length === 0) {
      Alert.alert('No Items', 'Please add at least one item to save the entry.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    let notificationId: string | undefined;
    let expectedPickupTime: string | undefined;

    // Schedule notification based on pickup type
    try {
      if (pickupType === 'minutes') {
        const minutes = parseInt(pickupMinutes);
        if (minutes > 0) {
          const pickupDateCalc = new Date(Date.now() + minutes * 60000);
          expectedPickupTime = pickupDateCalc.toISOString();
          notificationId = await schedulePickupNotification(
            Date.now().toString(),
            minutes,
            alarmEnabled
          );
        }
      } else {
        if (pickupDate > new Date()) {
          expectedPickupTime = pickupDate.toISOString();
          notificationId = await schedulePickupNotificationAtTime(
            Date.now().toString(),
            pickupDate,
            alarmEnabled
          );
        }
      }
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }

    addRecord({
      dateGiven: today,
      dateReturned: null,
      items,
      notes: notes.trim() || undefined,
      expectedPickupTime,
      alarmEnabled,
      notificationId,
    });

    Alert.alert('Success', 'Laundry entry saved!', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const totalItems = Object.values(itemCounts).reduce((sum, count) => sum + count, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateText}>Date: {new Date().toLocaleDateString()}</Text>
        
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes about this laundry batch..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.pickupContainer}>
          <Text style={styles.sectionTitle}>Pickup Reminder</Text>
          
          <View style={styles.pickupTypeButtons}>
            <TouchableOpacity
              style={[styles.typeButton, pickupType === 'minutes' && styles.typeButtonActive]}
              onPress={() => setPickupType('minutes')}
            >
              <Text style={[styles.typeButtonText, pickupType === 'minutes' && styles.typeButtonTextActive]}>
                Quick (Minutes)
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.typeButton, pickupType === 'time' && styles.typeButtonActive]}
              onPress={() => setPickupType('time')}
            >
              <Text style={[styles.typeButtonText, pickupType === 'time' && styles.typeButtonTextActive]}>
                Specific Time
              </Text>
            </TouchableOpacity>
          </View>

          {pickupType === 'minutes' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pickup in (minutes)</Text>
              <TextInput
                style={styles.timeInput}
                value={pickupMinutes}
                onChangeText={setPickupMinutes}
                placeholder="60"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <Text style={styles.helperText}>
                {pickupMinutes ? `≈ ${Math.round(parseInt(pickupMinutes) / 60)} hour(s)` : 'For washing machines'}
              </Text>
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Pickup Date & Time</Text>
              
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeButtonLabel}>📅 Date:</Text>
                <Text style={styles.dateTimeButtonValue}>
                  {pickupDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonLabel}>🕐 Time:</Text>
                <Text style={styles.dateTimeButtonValue}>
                  {pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setPickupDate(selectedDate);
                    }
                  }}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={pickupDate}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setPickupDate(selectedDate);
                    }
                  }}
                />
              )}

              <Text style={styles.helperText}>
                Reminder set for: {pickupDate.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.alarmToggle}>
            <View style={styles.alarmTextContainer}>
              <Text style={styles.alarmLabel}>Enable Alarm 🔔</Text>
              <Text style={styles.alarmSubtext}>Play sound and vibrate when reminder triggers</Text>
            </View>
            <Switch
              value={alarmEnabled}
              onValueChange={setAlarmEnabled}
              trackColor={{ false: '#d0d0d0', true: '#a5d6a7' }}
              thumbColor={alarmEnabled ? '#2e7d32' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <Text style={styles.categoriesLabel}>Items</Text>
        
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => handleDecrement(category.id)}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              
              <Text style={styles.countText}>{itemCounts[category.id] || 0}</Text>
              
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => handleIncrement(category.id)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total Items: {totalItems}</Text>
        <TouchableOpacity
          style={[styles.saveButton, totalItems === 0 && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={totalItems === 0}
        >
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 80,
    elevation: 1,
  },
  categoriesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  pickupContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  pickupTypeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#90caf9',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#1e3a5f',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  alarmToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  alarmTextContainer: {
    flex: 1,
  },
  alarmLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  alarmSubtext: {
    fontSize: 12,
    color: '#666',
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  dateTimeButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  dateTimeButtonValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#90caf9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: '#1e3a5f',
    fontSize: 24,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#a5d6a7',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#2e7d32',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
