import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { HistoryScreenProps } from '../Navigation';
import { useLaundryStore } from '../store/laundryStore';

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const records = useLaundryStore((state) => state.records);

  const renderItem = ({ item }: { item: any }) => {
    const date = new Date(item.dateGiven).toLocaleDateString();
    const isPending = item.status === 'pending';
    
    return (
      <TouchableOpacity
        style={styles.recordItem}
        onPress={() => navigation.navigate('Detail', { recordId: item.id })}
      >
        <View style={styles.recordHeader}>
          <Text style={styles.dateText}>{date}</Text>
          <View style={[styles.statusBadge, isPending ? styles.pendingBadge : styles.returnedBadge]}>
            <Text style={styles.statusText}>
              {isPending ? 'Pending' : 'Returned ✓'}
            </Text>
          </View>
        </View>
        
        <View style={styles.itemsPreview}>
          {item.items.slice(0, 3).map((laundryItem: any, index: number) => (
            <Text key={index} style={styles.previewText}>
              {laundryItem.categoryIcon} {laundryItem.categoryName} ({laundryItem.quantity})
            </Text>
          ))}
          {item.items.length > 3 && (
            <Text style={styles.moreText}>+{item.items.length - 3} more</Text>
          )}
        </View>
        
        <Text style={styles.totalText}>Total: {item.totalItems} items</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>No laundry records yet</Text>
          <Text style={styles.emptySubtext}>Add your first entry to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f3',
  },
  listContainer: {
    padding: 16,
  },
  recordItem: {
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  itemsPreview: {
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5e92c4',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
