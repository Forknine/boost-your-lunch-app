import { AppAnnouncement, ChildProfile, NotificationPreferences, ScheduledOrderItem, SupportThread } from '../models';

export type AppDataBundle = {
  announcement: AppAnnouncement;
  children: ChildProfile[];
  scheduledOrders: ScheduledOrderItem[];
  supportThreads: SupportThread[];
  notificationLog: string[];
  notificationPreferences: NotificationPreferences;
  programs: string[];
  serviceDates: string[];
};

export type DraftInput = {
  childId: string;
  program: string;
  serviceDates: string[];
};

export type SupportThreadInput = {
  category: 'Order Help' | 'Cancellation/Refund' | 'School Question' | 'App Issue' | 'General';
  subject: string;
};

export interface AppRepository {
  fetchBundle(): Promise<AppDataBundle>;
  createDraft(input: DraftInput): Promise<{ draftId: string }>;
  createSupportThread(input: SupportThreadInput): Promise<{ threadId: string; updatedAt: string }>;
  updateNotificationPreferences(input: NotificationPreferences): Promise<NotificationPreferences>;
}
