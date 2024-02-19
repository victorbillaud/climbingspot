'use client';
import { Button, Flex, Text } from '@/components/common';
import { FormEvent } from 'react';
import { deleteAccount } from './action';

export default function DeleteAccountPage() {
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      if (confirm('Are you sure you want to delete your account?'))
        await deleteAccount(formData);
    } catch (error) {
      console.error('Failed to delete account', error);
    }
  };

  return (
    <Flex className="p-10" direction="column" gap={4}>
      <Text variant="h2">Delete Account</Text>
      <Text variant="body">
        Are you sure you want to delete your account? This action is
        irreversible and will delete all your data.
      </Text>
      <form onSubmit={onSubmit}>
        <Flex>
          <Flex direction="row" horizontalAlign="center" gap={2}>
            <input
              type="checkbox"
              name="deleteSpots"
              id="deleteSpots"
              value={'true'}
            />
            <label htmlFor="deleteSpots">Delete all your spots</label>
          </Flex>
          <Button type="submit" variant="alert" text="Delete Account" />
        </Flex>
      </form>
    </Flex>
  );
}
