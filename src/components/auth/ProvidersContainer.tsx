'use client';

import { Button, Flex } from '@/components/common';
import { useSearchParams } from 'next/navigation';
import { useSupabase } from './SupabaseProvider';

export const ProvidersContainer = () => {
  const { supabase } = useSupabase();
  const params = useSearchParams();

  const handleLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: params.get('redirect') || '/',
      },
    });

    if (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <Flex>
        <Button
          title={`Continue with Google`}
          variant="primary"
          size="large"
          icon={'google'}
          onClick={() => {
            handleLogin('google');
          }}
          className="w-full"
        />
      </Flex>
      <Flex>
        <Button
          title={`Continue with Github`}
          variant="primary"
          size="large"
          icon={'github'}
          onClick={() => {
            handleLogin('github');
          }}
          className="w-full"
        />
      </Flex>
    </>
  );
};