'use client';

import type { Database } from '@/lib/db_types';
import {
  Session,
  SupabaseClient,
  User,
  createBrowserSupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

const AuthContext = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider(props: {
  accessToken: string;
  children: React.ReactNode;
}) {
  const [initial, setInitial] = useState(true);
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { accessToken, ...rest } = props;

  useEffect(() => {
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setInitial(false);
    }
    getActiveSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const value = useMemo(() => {
    return {
      initial,
      session,
      user,
      supabase,
      signOut: () => supabase.auth.signOut(),
    };
  }, [initial, session, user]);

  return <AuthContext.Provider value={value} {...rest} />;
}

export const useSupabase = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};
