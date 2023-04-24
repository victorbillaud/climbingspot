'use client';

import { useSupabase } from '@/components/auth/SupabaseProvider';
import { Button, Flex, InputText, Text } from '@/components/common';
import useCustomForm from '@/features/spots/hooks';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [form, setForm, error, setError] = useCustomForm(
    {
      password: '',
      passwordConfirmation: '',
    },
    false,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password) {
      setError({ password: 'Password is required' });
      return;
    }

    if (!form.passwordConfirmation) {
      setError({ passwordConfirmation: 'Password confirmation is required' });
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: form.password,
    });

    if (error) {
      logger.error(error);
      toast.error(error.message);
      return;
    }

    if (data.user) {
      toast.success('Password updated successfully');
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    if (form.passwordConfirmation !== '' && form.password !== '') {
      if (form.passwordConfirmation !== form.password) {
        setError({ passwordConfirmation: 'Passwords do not match' });
      } else {
        setError({ passwordConfirmation: undefined });
      }
    }
  }, [form.passwordConfirmation]);

  return (
    <Flex fullSize>
      <Text variant="h3" color="text-brand-600 dark:text-brand-400">
        Reset your password
      </Text>
      <form className="w-full" onSubmit={handleSubmit}>
        <Flex fullSize className="p-3">
          <InputText
            labelText="Password"
            value={form.password}
            onChange={(e) => setForm.password(e.target.value)}
            name="password"
            type="password"
            className="w-full"
            error={error.password}
          />
          <InputText
            labelText="Password Confirmation"
            value={form.passwordConfirmation}
            onChange={(e) => setForm.passwordConfirmation(e.target.value)}
            name="passwordConfirmation"
            type="password"
            className="w-full"
            error={error.passwordConfirmation}
          />
          <Button
            className="w-full"
            text="Reset Password"
            variant="default"
            type="submit"
          />
        </Flex>
      </form>
    </Flex>
  );
};

export default ResetPasswordPage;
