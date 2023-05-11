'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Button, Flex } from '@/components/common';

export const Logout = () => {
  const { signOut } = useSupabase();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Flex direction="row">
      <Button text="Logout" variant="alert" onClick={handleLogout} />
    </Flex>
  );
};
