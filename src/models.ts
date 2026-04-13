export type OrderStatus =
  | 'Draft'
  | 'Pending Payment'
  | 'Confirmed'
  | 'Editable'
  | 'Locked'
  | 'Cancelled'
  | 'Refunded'
  | 'Fulfilled';

export type ChildProfile = {
  id: string;
  firstName: string;
  lastName?: string;
  school: string;
  classroom: string;
  grade: string;
  notes?: string;
  active: boolean;
};

export type ScheduledOrderItem = {
  id: string;
  childId: string;
  childName: string;
  serviceDate: string;
  program: string;
  menuItem: string;
  modifiers?: string[];
  quantity: number;
  status: OrderStatus;
  editableUntil?: string;
  shopifyOrderRef?: string;
};

export type SupportThread = {
  id: string;
  subject: string;
  category: 'Order Help' | 'Cancellation/Refund' | 'School Question' | 'App Issue' | 'General';
  updatedAt: string;
  unread: boolean;
};

export type AppAnnouncement = {
  id: string;
  title: string;
  body: string;
  ctaLabel?: string;
};

export type NotificationPreferences = {
  morningReminder: boolean;
  cutoffReminder: boolean;
};
