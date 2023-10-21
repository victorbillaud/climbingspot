import useCustomForm from '@/features/spots/hooks';
import { logger } from '@/lib/logger';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button, Flex, InfoCard, InputText, Text } from '../common';
import { ProvidersContainer } from './ProvidersContainer';
import { useSupabase } from './SupabaseProvider';

export type TLoginFormProps = {};

export const LoginForm = (props: TLoginFormProps) => {
  const { supabase } = useSupabase();
  const router = useRouter();
  const params = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [form, setForm, formErrors, setFormErrors] = useCustomForm({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!form.email) {
      setFormErrors({ email: 'Email is required' });
      return;
    }

    if (!form.password) {
      setFormErrors({ password: 'Password is required' });
      return;
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      logger.error(error);
      setError(error);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      router.push(params?.get('redirect') || '/');
      router.refresh();
      setIsLoading(false);
      return;
    }
  };

  return (
    <Flex fullSize>
      <form className="w-full" onSubmit={handleLogin}>
        <Flex className="w-full py-3">
          <InputText
            labelText="email"
            type="email"
            placeholder="example@example.com"
            error={formErrors.email}
            value={form.email}
            className="w-full"
            onChange={(e) => setForm.email(e.target.value)}
          />
          <InputText
            labelText="password"
            type="password"
            placeholder="********"
            error={formErrors.password}
            value={form.password}
            className="w-full"
            onChange={(e) => setForm.password(e.target.value)}
          />
          <Button
            className="w-full"
            text="Login"
            variant="default"
            isLoader={isLoading}
            type="submit"
          />
          <Text variant="caption">Or</Text>
        </Flex>
      </form>
      <ProvidersContainer />
      <Link href="/auth/register" passHref>
        <Text variant="caption">You need to register ?</Text>
      </Link>
      {error && (
        <InfoCard message="Error" color="red" icon="warning">
          {error?.message}
        </InfoCard>
      )}
    </Flex>
  );
};
