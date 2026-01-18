import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { HistoryScreenProps } from '../Navigation';
import { useLaundryStore } from '../store/laundryStore';
import { useThemeStore } from '../store/themeStore';

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const records = useLaundryStore((state) => state.records);
  const theme = useThemeStore((state) => state.theme);

  const renderItem = ({ item }: { item: any }) => {
    const date = new Date(item.dateGiven).toLocaleDateString();
    const isPending = item.status === 'pending';
    
    return (
      <TouchableOpacity
        style={[styles.recordItem, { backgroundColor: theme.cardBackground }]}
        onPress={() => navigation.navigate('Detail', { recordId: item.id })}
      >
        <View style={styles.recordHeader}>
          <Text style={[styles.dateText, { color: theme.primaryText }]}>{date}</Text>
          <View style={[styles.statusBadge, isPending ? { backgroundColor: theme.pendingBadge } : { backgroundColor: theme.returnedBadge }]}>
            <Text style={[styles.statusText, { color: isPending ? theme.pendingText : theme.returnedText }]}>
              {isPending ? 'Pending' : 'Returned ✓'}
            </Text>
          </View>
        </View>
        
        <View style={styles.itemsPreview}>
          {item.items.slice(0, 3).map((laundryItem: any, index: number) => (
            <Text key={index} style={[styles.previewText, { color: theme.secondaryText }]}>
              {laundryItem.categoryIcon} {laundryItem.categoryName} ({laundryItem.quantity})
            </Text>
          ))}
          {item.items.length > 3 && (
            <Text style={[styles.moreText, { color: theme.tertiaryText }]}>+{item.items.length - 3} more</Text>
          )}
        </View>
        
        <Text style={[styles.totalText, { color: theme.accentLight }]}>Total: {item.totalItems} items</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={[styles.emptyText, { color: theme.primaryText }]}>No laundry records yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.secondaryText }]}>Add your first entry to get started!</Text>
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
  },
  listContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  recordItem: {
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
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingBadge: {},
  returnedBadge: {},
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsPreview: {
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});
