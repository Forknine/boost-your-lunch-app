import { AppAnnouncement, ChildProfile, ScheduledOrderItem, SupportThread } from '../models';

export type AppDataBundle = {
  announcement: AppAnnouncement;
  children: ChildProfile[];
  scheduledOrders: ScheduledOrderItem[];
  supportThreads: SupportThread[];
  notificationLog: string[];
  programs: string[];
  serviceDates: string[];
};

export type DraftInput = {
  childId: string;
  program: string;
  serviceDates: string[];
};

export interface AppRepository {
  fetchBundle(): Promise<AppDataBundle>;
  createDraft(input: DraftInput): Promise<{ draftId: string }>;
}
