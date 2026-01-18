import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { DetailScreenProps } from '../Navigation';
import { useLaundryStore } from '../store/laundryStore';
import { useThemeStore } from '../store/themeStore';

export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const { recordId } = route.params;
  const records = useLaundryStore((state) => state.records);
  const markAsReturned = useLaundryStore((state) => state.markAsReturned);
  const deleteRecord = useLaundryStore((state) => state.deleteRecord);
  const theme = useThemeStore((state) => state.theme);

  const record = records.find((r) => r.id === recordId);

  if (!record) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.secondaryText }]}>Record not found</Text>
      </View>
    );
  }

  const handleMarkAsReturned = () => {
    Alert.alert(
      'Mark as Returned',
      'Are you sure you want to mark this laundry as returned?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            markAsReturned(recordId);
            Alert.alert('Success', 'Laundry marked as returned!');
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this laundry entry? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteRecord(recordId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const isPending = record.status === 'pending';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Date Given:</Text>
            <Text style={[styles.infoValue, { color: theme.primaryText }]}>
              {new Date(record.dateGiven).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Status:</Text>
            <View style={[styles.statusBadge, isPending ? { backgroundColor: theme.pendingBadge } : { backgroundColor: theme.returnedBadge }]}>
              <Text style={[styles.statusText, { color: isPending ? theme.pendingText : theme.returnedText }]}>
                {isPending ? 'Pending' : 'Returned'}
              </Text>
            </View>
          </View>
          
          {record.dateReturned && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Date Returned:</Text>
              <Text style={[styles.infoValue, { color: theme.primaryText }]}>
                {new Date(record.dateReturned).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {record.expectedPickupTime && (
          <View style={[styles.pickupCard, { backgroundColor: theme.cardBackground, borderLeftColor: theme.accentLight }]}>
            <Text style={[styles.pickupTitle, { color: theme.primaryText }]}>📅 Expected Pickup</Text>
            <Text style={[styles.pickupTime, { color: theme.accentLight }]}>
              {new Date(record.expectedPickupTime).toLocaleString()}
            </Text>
            {record.alarmEnabled && (
              <Text style={[styles.alarmIndicator, { color: theme.secondaryText }]}>🔔 Alarm enabled</Text>
            )}
          </View>
        )}

        {record.notes && (
          <View style={[styles.notesCard, { backgroundColor: theme.cardBackground, borderLeftColor: theme.accentLight }]}>
            <Text style={[styles.notesTitle, { color: theme.primaryText }]}>Notes</Text>
            <Text style={[styles.notesText, { color: theme.secondaryText }]}>{record.notes}</Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Items</Text>
        
        {record.items.map((item, index) => (
          <View key={index} style={[styles.itemCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={styles.itemIcon}>{item.categoryIcon}</Text>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.primaryText }]}>{item.categoryName}</Text>
              <Text style={[styles.itemQuantity, { color: theme.secondaryText }]}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.totalCard, { backgroundColor: theme.accentLight }]}>
          <Text style={[styles.totalLabel, { color: theme.primaryButtonText }]}>Total Items:</Text>
          <Text style={[styles.totalValue, { color: theme.primaryButtonText }]}>{record.totalItems}</Text>
        </View>
      </ScrollView>

      <View style={[styles.actionButtons, { backgroundColor: theme.cardBackground, borderTopColor: theme.divider }]}>
        <View style={styles.buttonRow}>
          {isPending && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.successButton }]}
              onPress={handleMarkAsReturned}
            >
              <Text style={[styles.buttonText, { color: theme.successText }]}>Mark as Returned</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.dangerButton }, isPending && styles.deleteButtonWithReturn]}
            onPress={handleDelete}
          >
            <Text style={[styles.buttonText, { color: theme.dangerText }]}>Delete Entry</Text>
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
  infoCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingBadge: {},
  returnedBadge: {},
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 15,
    lineHeight: 22,
  },
  pickupCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  pickupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickupTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  alarmIndicator: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionButtons: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonWithReturn: {
    flex: 0.5,
  },
  returnButton: {},
  deleteButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
