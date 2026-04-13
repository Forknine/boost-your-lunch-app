import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { AppAnnouncement, ChildProfile, ScheduledOrderItem, SupportThread } from './models';
import { DraftInput } from './data/repository';
import { MockRepository } from './data/mockRepository';

type AppDataState = {
  announcement: AppAnnouncement;
  children: ChildProfile[];
  scheduledOrders: ScheduledOrderItem[];
  supportThreads: SupportThread[];
  notificationLog: string[];
  programs: string[];
  serviceDates: string[];
};

type AppDataContextValue = {
  data: AppDataState;
  loading: boolean;
  refresh: () => Promise<void>;
  createDraft: (input: DraftInput) => Promise<{ draftId: string }>;
};

const repo = new MockRepository();

const seedData: AppDataState = {
  announcement: { id: 'boot', title: 'Loading announcement', body: 'Please wait...' },
  children: [],
  scheduledOrders: [],
  supportThreads: [],
  notificationLog: [],
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

  const value = useMemo<AppDataContextValue>(
    () => ({ data, loading, refresh, createDraft }),
    [data, loading, refresh, createDraft]
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
