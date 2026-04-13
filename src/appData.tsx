import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { AppAnnouncement, ChildProfile, NotificationItem, NotificationPreferences, ScheduledOrderItem, SupportThread } from './models';
import { DraftInput, SupportThreadInput } from './data/repository';
import { MockRepository } from './data/mockRepository';
import { SupabaseRepository } from './data/supabaseRepository';

type AppDataState = {
  announcement: AppAnnouncement;
  children: ChildProfile[];
  scheduledOrders: ScheduledOrderItem[];
  supportThreads: SupportThread[];
  notificationLog: NotificationItem[];
  notificationPreferences: NotificationPreferences;
  programs: string[];
  serviceDates: string[];
};

type AppDataContextValue = {
  data: AppDataState;
  loading: boolean;
  provider: 'mock' | 'supabase';
  refresh: () => Promise<void>;
  createDraft: (input: DraftInput) => Promise<{ draftId: string }>;
  createSupportThread: (input: SupportThreadInput) => Promise<{ threadId: string }>;
  updateNotificationPreferences: (input: NotificationPreferences) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  updateChildStatus: (childId: string, active: boolean) => Promise<void>;
};

const provider = process.env.EXPO_PUBLIC_DATA_PROVIDER === 'supabase' ? 'supabase' : 'mock';
const repo = provider === 'supabase' ? new SupabaseRepository() : new MockRepository();

const seedData: AppDataState = {
  announcement: { id: 'boot', title: 'Loading announcement', body: 'Please wait...' },
  children: [],
  scheduledOrders: [],
  supportThreads: [],
  notificationLog: [],
  notificationPreferences: { morningReminder: true, cutoffReminder: true },
  programs: [],
  serviceDates: []
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppDataState>(seedData);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const bundle = await repo.fetchBundle();
    setData(bundle);
    setLoading(false);
  }, []);

  const createDraft = useCallback(async (input: DraftInput) => {
    return repo.createDraft(input);
  }, []);

  const createSupportThread = useCallback(async (input: SupportThreadInput) => {
    const created = await repo.createSupportThread(input);
    setData((prev) => ({
      ...prev,
      supportThreads: [
        {
          id: created.threadId,
          subject: input.subject,
          category: input.category,
          updatedAt: created.updatedAt,
          unread: false
        },
        ...prev.supportThreads
      ]
    }));
    return { threadId: created.threadId };
  }, []);

  const updateNotificationPreferences = useCallback(async (input: NotificationPreferences) => {
    const updated = await repo.updateNotificationPreferences(input);
    setData((prev) => ({ ...prev, notificationPreferences: updated }));
  }, []);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    await repo.markNotificationRead(notificationId);
    setData((prev) => ({
      ...prev,
      notificationLog: prev.notificationLog.map((item) => (item.id === notificationId ? { ...item, read: true } : item))
    }));
  }, []);

  const updateChildStatus = useCallback(async (childId: string, active: boolean) => {
    await repo.updateChildStatus(childId, active);
    setData((prev) => ({
      ...prev,
      children: prev.children.map((child) => (child.id === childId ? { ...child, active } : child))
    }));
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({ data, loading, provider, refresh, createDraft, createSupportThread, updateNotificationPreferences, markNotificationRead, updateChildStatus }),
    [data, loading, refresh, createDraft, createSupportThread, updateNotificationPreferences, markNotificationRead, updateChildStatus]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
