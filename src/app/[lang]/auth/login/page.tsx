import { LoginForm } from '@/components/auth';
import { Flex, Text } from '@/components/common';

export const revalidate = 0;

const LoginPage = async () => {
  return (
    <Flex gap={3} className="w-full">
      <Text variant="h3" color="text-brand-600 dark:text-brand-400">
        Happy to see you again!
      </Text>
      <Text variant="body" className="opacity-50">
        You must be logged in add new post, comment or create events.
      </Text>
      <LoginForm />
    </Flex>
  );
};

export default LoginPage;
