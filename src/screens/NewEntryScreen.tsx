import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NewEntryScreenProps } from '../Navigation';
import { useCategoryStore } from '../store/categoryStore';
import { useLaundryStore } from '../store/laundryStore';
import { useThemeStore } from '../store/themeStore';
import { LaundryItem } from '../types';
import { registerForPushNotificationsAsync, schedulePickupNotification, schedulePickupNotificationAtTime } from '../utils/notifications';

export default function NewEntryScreen({ navigation }: NewEntryScreenProps) {
  const categories = useCategoryStore((state) => state.categories);
  const addRecord = useLaundryStore((state) => state.addRecord);
  const theme = useThemeStore((state) => state.theme);
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.dateText, { color: theme.primaryText }]}>Date: {new Date().toLocaleDateString()}</Text>
        
        <View style={styles.notesContainer}>
          <Text style={[styles.notesLabel, { color: theme.secondaryText }]}>Notes (Optional)</Text>
          <TextInput
            style={[styles.notesInput, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.inputText }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes about this laundry batch..."
            placeholderTextColor={theme.placeholder}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.pickupContainer, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Pickup Reminder</Text>
          
          <View style={styles.pickupTypeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
                pickupType === 'minutes' && { backgroundColor: theme.secondaryButton, borderColor: theme.secondaryButton }
              ]}
              onPress={() => setPickupType('minutes')}
            >
              <Text style={[
                styles.typeButtonText,
                { color: theme.secondaryText },
                pickupType === 'minutes' && { color: theme.secondaryButtonText }
              ]}>
                Quick (Minutes)
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
                pickupType === 'time' && { backgroundColor: theme.secondaryButton, borderColor: theme.secondaryButton }
              ]}
              onPress={() => setPickupType('time')}
            >
              <Text style={[
                styles.typeButtonText,
                { color: theme.secondaryText },
                pickupType === 'time' && { color: theme.secondaryButtonText }
              ]}>
                Specific Time
              </Text>
            </TouchableOpacity>
          </View>

          {pickupType === 'minutes' ? (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Pickup in (minutes)</Text>
              <TextInput
                style={[styles.timeInput, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.inputText }]}
                value={pickupMinutes}
                onChangeText={setPickupMinutes}
                placeholder="60"
                keyboardType="numeric"
                placeholderTextColor={theme.placeholder}
              />
              <Text style={[styles.helperText, { color: theme.tertiaryText }]}>
                {pickupMinutes ? `≈ ${Math.round(parseInt(pickupMinutes) / 60)} hour(s)` : 'For washing machines'}
              </Text>
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Select Pickup Date & Time</Text>
              
              <TouchableOpacity
                style={[styles.dateTimeButton, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateTimeButtonLabel, { color: theme.secondaryText }]}>📅 Date:</Text>
                <Text style={[styles.dateTimeButtonValue, { color: theme.primaryText }]}>
                  {pickupDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dateTimeButton, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={[styles.dateTimeButtonLabel, { color: theme.secondaryText }]}>🕐 Time:</Text>
                <Text style={[styles.dateTimeButtonValue, { color: theme.primaryText }]}>
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

              <Text style={[styles.helperText, { color: theme.tertiaryText }]}>
                Reminder set for: {pickupDate.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={[styles.alarmToggle, { borderTopColor: theme.divider }]}>
            <View style={styles.alarmTextContainer}>
              <Text style={[styles.alarmLabel, { color: theme.primaryText }]}>Enable Alarm 🔔</Text>
              <Text style={[styles.alarmSubtext, { color: theme.secondaryText }]}>Play sound and vibrate when reminder triggers</Text>
            </View>
            <Switch
              value={alarmEnabled}
              onValueChange={setAlarmEnabled}
              trackColor={{ false: theme.border, true: theme.successButton }}
              thumbColor={alarmEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <Text style={[styles.categoriesLabel, { color: theme.primaryText }]}>Items</Text>
        
        {categories.map((category) => (
          <View key={category.id} style={[styles.categoryItem, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[styles.categoryName, { color: theme.primaryText }]}>{category.name}</Text>
            </View>
            
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: theme.secondaryButton }]}
                onPress={() => handleDecrement(category.id)}
              >
                <Text style={[styles.counterButtonText, { color: theme.secondaryButtonText }]}>−</Text>
              </TouchableOpacity>
              
              <Text style={[styles.countText, { color: theme.primaryText }]}>{itemCounts[category.id] || 0}</Text>
              
              <TouchableOpacity
                style={[styles.counterButton, { backgroundColor: theme.secondaryButton }]}
                onPress={() => handleIncrement(category.id)}
              >
                <Text style={[styles.counterButtonText, { color: theme.secondaryButtonText }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: theme.cardBackground, borderTopColor: theme.divider }]}>
        <View style={styles.footerContent}>
          <Text style={[styles.totalText, { color: theme.primaryText }]}>Total: {totalItems}</Text>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.successButton }, totalItems === 0 && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={totalItems === 0}
          >
            <Text style={[styles.saveButtonText, { color: theme.successText }]}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    elevation: 1,
  },
  categoriesLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickupContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonActive: {},
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeButtonTextActive: {},
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  alarmToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  alarmTextContainer: {
    flex: 1,
  },
  alarmLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  alarmSubtext: {
    fontSize: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  dateTimeButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  dateTimeButtonValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
