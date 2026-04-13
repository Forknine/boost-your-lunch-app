import React, { createContext, useContext, useMemo, useState } from 'react';

import { announcement, children, notificationLog, programs, scheduledOrders, serviceDates, supportThreads } from './mockData';
import { AppAnnouncement, ChildProfile, ScheduledOrderItem, SupportThread } from './models';

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
};

const seedData: AppDataState = {
  announcement,
  children,
  scheduledOrders,
  supportThreads,
  notificationLog,
  programs,
  serviceDates
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data] = useState<AppDataState>(seedData);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(false);
  };

  const value = useMemo<AppDataContextValue>(
    () => ({ data, loading, refresh }),
    [data, loading]
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
