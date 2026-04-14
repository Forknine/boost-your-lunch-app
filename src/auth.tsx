import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  status: 'signed_out' | 'signed_in';
  email?: string;
};

type AuthContextValue = {
  auth: AuthState;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: 'signed_out' });

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      login: (email: string) => setAuth({ status: 'signed_in', email }),
      logout: () => setAuth({ status: 'signed_out' })
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
