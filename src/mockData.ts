import { AppAnnouncement, ChildProfile, ScheduledOrderItem, SupportThread } from './models';

export const announcement: AppAnnouncement = {
  id: 'ann_001',
  title: 'Milk ordering is open',
  body: 'Place or update April milk orders before 8:00 PM tonight.',
  ctaLabel: 'Order now'
};

export const programs = ['Hot Lunch', 'Pizza Friday', 'Special Menu'];

export const serviceDates = ['2026-04-16', '2026-04-17', '2026-04-20', '2026-04-21'];

export const children: ChildProfile[] = [
  {
    id: 'child_mia',
    firstName: 'Mia',
    lastName: 'Johnson',
    school: 'Maple Elementary',
    classroom: 'Ms. Rivera',
    grade: '4',
    notes: 'Nut allergy',
    active: true
  },
  {
    id: 'child_leo',
    firstName: 'Leo',
    lastName: 'Johnson',
    school: 'Maple Elementary',
    classroom: 'Mr. Singh',
    grade: '2',
    active: true
  }
];

export const scheduledOrders: ScheduledOrderItem[] = [
  {
    id: 'ord_001',
    childId: 'child_mia',
    childName: 'Mia Johnson',
    serviceDate: '2026-04-16',
    program: 'Hot Lunch',
    menuItem: 'Chicken Teriyaki Bowl',
    modifiers: ['Brown rice'],
    quantity: 1,
    status: 'Editable',
    editableUntil: '2026-04-15T18:00:00Z',
    shopifyOrderRef: 'SH-12940'
  },
  {
    id: 'ord_002',
    childId: 'child_leo',
    childName: 'Leo Johnson',
    serviceDate: '2026-04-17',
    program: 'Pizza Friday',
    menuItem: 'Cheese Pizza Slice',
    quantity: 1,
    status: 'Locked',
    editableUntil: '2026-04-16T18:00:00Z',
    shopifyOrderRef: 'SH-12941'
  },
  {
    id: 'ord_003',
    childId: 'child_mia',
    childName: 'Mia Johnson',
    serviceDate: '2026-04-02',
    program: 'Hot Lunch',
    menuItem: 'Turkey Sandwich',
    quantity: 1,
    status: 'Fulfilled',
    shopifyOrderRef: 'SH-12711'
  },
  {
    id: 'ord_004',
    childId: 'child_leo',
    childName: 'Leo Johnson',
    serviceDate: '2026-04-01',
    program: 'Special Menu',
    menuItem: 'Mac & Cheese',
    quantity: 1,
    status: 'Cancelled',
    shopifyOrderRef: 'SH-12692'
  }
];

export const supportThreads: SupportThread[] = [
  {
    id: 'thr_001',
    subject: 'Need to update Apr 17 lunch after cutoff',
    category: 'Order Help',
    updatedAt: '2026-04-13 08:12 AM',
    unread: true
  },
  {
    id: 'thr_002',
    subject: 'Refund question for cancelled order',
    category: 'Cancellation/Refund',
    updatedAt: '2026-04-12 04:47 PM',
    unread: false
  }
];

export const notificationLog = [
  'Order confirmed for Mia on Apr 16',
  'Ordering closes tonight at 8:00 PM',
  'Support replied to your request'
];
