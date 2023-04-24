'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Button, Flex } from '@/components/common';
import { useRouter } from 'next/navigation';

export const Logout = () => {
  const router = useRouter();
  const { signOut } = useSupabase();

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      console.log({ error });
    } else {
      router.refresh();
    }
  };

  return (
    <Flex direction="row">
      <Button text="Logout" variant="alert" onClick={handleLogout} />
    </Flex>
  );
};
