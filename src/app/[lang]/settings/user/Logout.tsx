'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Button } from '@/components/common';

export const Logout = () => {
  const { signOut } = useSupabase();

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      console.log({ error });
    }
  };

  return <Button text="Logout" variant="alert" onClick={handleLogout} />;
};
