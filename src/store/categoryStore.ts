import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;
  resetToDefaults: () => void;
  importCategories: (categories: Category[]) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Shirts', icon: '👕', order: 1 },
  { id: '2', name: 'Pants', icon: '👖', order: 2 },
  { id: '3', name: 'Track Pants', icon: '🩳', order: 3 },
  { id: '4', name: 'Shorts', icon: '🩳', order: 4 },
  { id: '5', name: 'Inners', icon: '🩲', order: 5 },
  { id: '6', name: 'Socks', icon: '🧦', order: 6 },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      
      addCategory: (category) =>
        set((state) => {
          const newId = Date.now().toString();
          const newOrder = state.categories.length + 1;
          return {
            categories: [
              ...state.categories,
              { ...category, id: newId, order: newOrder },
            ],
          };
        }),
      
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        })),
      
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        })),
      
      reorderCategories: (categories) =>
        set({ categories }),
      
      resetToDefaults: () =>
        set({ categories: defaultCategories }),
      
      importCategories: (categories) =>
        set({ categories }),
    }),
    {
      name: 'laundry-categories-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
