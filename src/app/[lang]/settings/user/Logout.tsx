'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Button, Flex } from '@/components/common';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export const Logout = () => {
  const router = useRouter();
  const { signOut } = useSupabase();
  const { resolvedTheme, setTheme } = useTheme();

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      console.log({ error });
    } else {
      router.refresh();
    }
  };

  return (
    <Flex>
      <Button
        text="Toggle Theme"
        variant={resolvedTheme === 'dark' ? 'primary' : 'secondary'}
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      />
      <Button
        text="System Theme"
        variant={resolvedTheme === 'system' ? 'primary' : 'secondary'}
        onClick={() => setTheme('system')}
      />
      <Button text="Logout" variant="alert" onClick={handleLogout} />
    </Flex>
  );
};
