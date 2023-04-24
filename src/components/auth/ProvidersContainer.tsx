'use client';

import { Button, Flex } from '@/components/common';
import { useSupabase } from './SupabaseProvider';

export const ProvidersContainer = () => {
  const { supabase } = useSupabase();

  const handleLogin = async (provider: 'google' | 'github') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  };

  return (
    <Flex className="w-full">
      <Button
        text={`Continue with Google`}
        variant="primary"
        size="large"
        icon={'google'}
        onClick={() => {
          handleLogin('google');
        }}
        className="w-full"
      />
    </Flex>
  );
};
