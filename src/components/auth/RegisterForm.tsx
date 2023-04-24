import useCustomForm from '@/features/spots/hooks';
import { logger } from '@/lib/logger';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Flex, InfoCard, InputText, Text } from '../common';
import { useSupabase } from './SupabaseProvider';

export type TRegisterFormProps = {};

export const RegisterForm = (props: TRegisterFormProps) => {
  const { supabase } = useSupabase();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm, formErrors, setFormErrors] = useCustomForm(
    {
      email: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      avatar_url: 'https://avatars.githubusercontent.com/u/125676?v=4',
    },
    false,
  );

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!form.email) {
      setFormErrors({ email: 'Email is required' });
      setIsLoading(false);
      return;
    }

    if (!form.password) {
      setFormErrors({ password: 'Password is required' });
      setIsLoading(false);
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL,
        data: {
          full_name: `${form.firstName} ${form.lastName}`,
          avatar_url: form.avatar_url,
        },
      },
    });

    if (error) {
      logger.error(error);
      setError(error);
      setIsLoading(false);
      return;
    }

    if (!data.session && !data.user) {
      setError(new Error('User not created'));
      setIsLoading(false);
      return;
    }

    if (!data.session && data.user) {
      setSuccess(
        'User created. Please check your email to confirm your account',
      );
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (form.passwordConfirmation !== '' && form.password !== '') {
      if (form.passwordConfirmation !== form.password) {
        setFormErrors({ passwordConfirmation: 'Passwords do not match' });
      } else {
        setFormErrors({ passwordConfirmation: undefined });
      }
    }
  }, [form.passwordConfirmation]);

  return (
    <Flex fullSize className="p-3">
      <InputText
        labelText="email"
        error={formErrors.email}
        value={form.email}
        className="w-full"
        onChange={(e) => setForm.email(e.target.value)}
      />
      <Flex className="w-full" direction="row">
        <InputText
          labelText="first name"
          error={formErrors.firstName}
          value={form.firstName}
          className="w-full"
          onChange={(e) => setForm.firstName(e.target.value)}
        />
        <InputText
          labelText="last name"
          error={formErrors.lastName}
          value={form.lastName}
          className="w-full"
          onChange={(e) => setForm.lastName(e.target.value)}
        />
      </Flex>
      <InputText
        labelText="password"
        type="password"
        error={formErrors.password}
        value={form.password}
        className="w-full"
        onChange={(e) => setForm.password(e.target.value)}
      />
      <InputText
        labelText="password confirmation"
        type="password"
        error={formErrors.passwordConfirmation}
        value={form.passwordConfirmation}
        className="w-full"
        onChange={(e) => setForm.passwordConfirmation(e.target.value)}
      />
      <Button
        className="w-full"
        text="Register"
        variant="default"
        isLoader={isLoading}
        onClick={handleRegister}
      />
      <Link href="/auth/login" passHref>
        <Text variant="caption">Already have an account? Login</Text>
      </Link>
      {error && (
        <InfoCard message="Error" color="red" icon="warning">
          {error?.message}
        </InfoCard>
      )}
      {success && (
        <InfoCard message="Success" color="green" icon="check">
          {success}
        </InfoCard>
      )}
    </Flex>
  );
};
