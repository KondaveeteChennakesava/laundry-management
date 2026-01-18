import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { DetailScreenProps } from '../Navigation';
import { useLaundryStore } from '../store/laundryStore';

export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const { recordId } = route.params;
  const records = useLaundryStore((state) => state.records);
  const markAsReturned = useLaundryStore((state) => state.markAsReturned);
  const deleteRecord = useLaundryStore((state) => state.deleteRecord);

  const record = records.find((r) => r.id === recordId);

  if (!record) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Record not found</Text>
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date Given:</Text>
            <Text style={styles.infoValue}>
              {new Date(record.dateGiven).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={[styles.statusBadge, isPending ? styles.pendingBadge : styles.returnedBadge]}>
              <Text style={styles.statusText}>
                {isPending ? 'Pending' : 'Returned'}
              </Text>
            </View>
          </View>
          
          {record.dateReturned && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date Returned:</Text>
              <Text style={styles.infoValue}>
                {new Date(record.dateReturned).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {record.expectedPickupTime && (
          <View style={styles.pickupCard}>
            <Text style={styles.pickupTitle}>📅 Expected Pickup</Text>
            <Text style={styles.pickupTime}>
              {new Date(record.expectedPickupTime).toLocaleString()}
            </Text>
            {record.alarmEnabled && (
              <Text style={styles.alarmIndicator}>🔔 Alarm enabled</Text>
            )}
          </View>
        )}

        {record.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{record.notes}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Items</Text>
        
        {record.items.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <Text style={styles.itemIcon}>{item.categoryIcon}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.categoryName}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        ))}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Items:</Text>
          <Text style={styles.totalValue}>{record.totalItems}</Text>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        {isPending && (
          <TouchableOpacity
            style={[styles.button, styles.returnButton]}
            onPress={handleMarkAsReturned}
          >
            <Text style={styles.buttonText}>Mark as Returned</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete Entry</Text>
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
  infoCard: {
    backgroundColor: '#fff',
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
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fff9c4',
  },
  returnedBadge: {
    backgroundColor: '#c8e6c9',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  notesCard: {
    backgroundColor: '#fff9e6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffb74d',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 15,
    color: '#5d4037',
    lineHeight: 22,
  },
  pickupCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#66bb6a',
  },
  pickupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  pickupTime: {
    fontSize: 16,
    color: '#1b5e20',
    fontWeight: '600',
  },
  alarmIndicator: {
    fontSize: 12,
    color: '#558b2f',
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#bbdefb',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a5f',
  },
  actionButtons: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  returnButton: {
    backgroundColor: '#a5d6a7',
  },
  deleteButton: {
    backgroundColor: '#ef9a9a',
  },
  buttonText: {
    color: '#2e3a3f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});
