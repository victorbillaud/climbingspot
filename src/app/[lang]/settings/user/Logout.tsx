'use client';

import { Button, Flex } from '@/components/common';

export const Logout = () => {
  return (
    <form action="/auth/signout" method="POST">
      <Flex direction="row">
        <Button text="Logout" variant="alert" type="submit" />
      </Flex>
    </form>
  );
};
