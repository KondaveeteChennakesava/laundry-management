export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface LaundryItem {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  quantity: number;
}

export interface LaundryRecord {
  id: string;
  dateGiven: string;
  dateReturned: string | null;
  items: LaundryItem[];
  totalItems: number;
  status: 'pending' | 'returned';
  notes?: string;
  expectedPickupTime?: string;
  alarmEnabled?: boolean;
  notificationId?: string;
}
