import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LaundryRecord } from '../types';
import { cancelNotification } from '../utils/notifications';

interface LaundryState {
  records: LaundryRecord[];
  addRecord: (record: Omit<LaundryRecord, 'id' | 'totalItems' | 'status'>) => void;
  updateRecord: (id: string, updates: Partial<LaundryRecord>) => void;
  deleteRecord: (id: string) => void;
  markAsReturned: (id: string) => void;
  getPendingRecords: () => LaundryRecord[];
  getReturnedRecords: () => LaundryRecord[];
}

export const useLaundryStore = create<LaundryState>()(
  persist(
    (set, get) => ({
      records: [],
      
      addRecord: (record) =>
        set((state) => {
          const totalItems = record.items.reduce((sum, item) => sum + item.quantity, 0);
          const newRecord: LaundryRecord = {
            ...record,
            id: Date.now().toString(),
            totalItems,
            status: 'pending',
          };
          return {
            records: [newRecord, ...state.records],
          };
        }),
      
      updateRecord: (id, updates) =>
        set((state) => ({
          records: state.records.map((record) => {
            if (record.id === id) {
              const updated = { ...record, ...updates };
              if (updates.items) {
                updated.totalItems = updates.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
              }
              return updated;
            }
            return record;
          }),
        })),
      
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        })),
      
      markAsReturned: (id) =>
        set((state) => {
          const record = state.records.find((r) => r.id === id);
          if (record?.notificationId) {
            cancelNotification(record.notificationId).catch(console.error);
          }
          return {
            records: state.records.map((record) =>
              record.id === id
                ? {
                    ...record,
                    status: 'returned' as const,
                    dateReturned: new Date().toISOString().split('T')[0],
                  }
                : record
            ),
          };
        }),
      
      getPendingRecords: () => get().records.filter((r) => r.status === 'pending'),
      getReturnedRecords: () => get().records.filter((r) => r.status === 'returned'),
    }),
    {
      name: 'laundry-records-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
