import { ScheduledOrderItem } from './models';

export function getUpcomingOrders(items: ScheduledOrderItem[]) {
  return items
    .filter((order) => ['Editable', 'Locked', 'Confirmed'].includes(order.status))
    .sort((a, b) => a.serviceDate.localeCompare(b.serviceDate));
}

export function getPastOrders(items: ScheduledOrderItem[]) {
  return items
    .filter((order) => ['Fulfilled', 'Cancelled', 'Refunded'].includes(order.status))
    .sort((a, b) => b.serviceDate.localeCompare(a.serviceDate));
}

export function toUserStatus(order: ScheduledOrderItem) {
  if (order.status === 'Editable') return 'Can modify';
  if (order.status === 'Locked') return 'Locked';
  if (order.status === 'Fulfilled') return 'Completed';
  if (order.status === 'Cancelled') return 'Cancelled';
  return order.status;
}

export function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function canModifyOrder(order: ScheduledOrderItem, now: Date = new Date()) {
  if (order.status !== 'Editable') return false;
  if (!order.editableUntil) return true;
  return now <= new Date(order.editableUntil);
}

export function editableUntilLabel(order: ScheduledOrderItem) {
  if (!order.editableUntil) return 'Editable window not set';
  const date = new Date(order.editableUntil);
  return `Editable until ${date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`;
}
