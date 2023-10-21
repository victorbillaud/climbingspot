import { Card, CustomImage, Flex, Text } from '@/components/common';
import { ThemeSelector, UserForm } from '@/components/user';
import { Database } from '@/lib/db_types';
import { logger } from '@/lib/logger';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Logout } from './Logout';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { user: user },
  } = await supabase.auth.getUser();

  if (!user) {
    supabase.auth.signOut();
    return notFound();
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    logger.error(`Profile not found for user ${user.id}`);
    return notFound();
  }

  return (
    <Flex fullSize>
      <Flex
        fullSize
        verticalAlign="top"
        horizontalAlign="left"
        className="p-1 md:p-3"
      >
        <Flex className="w-full p-3" direction="row" horizontalAlign="stretch">
          <Flex direction="row">
            <CustomImage
              src={profile.avatar_url as string}
              alt={profile.full_name as string}
              width={80}
              height={80}
              rounded="full"
            />
            <Flex verticalAlign="top" horizontalAlign="center" gap={0}>
              <Text variant="h3" weight={400} className="opacity-80">
                {profile.full_name}
              </Text>
              <Text variant="h4" weight={300} className="opacity-40">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </Text>
            </Flex>
          </Flex>
          <Logout />
        </Flex>
        <Flex verticalAlign="top" className="w-full px-3">
          <UserForm
            user={{
              email: user.email as string,
              ...profile,
            }}
          />
        </Flex>
        <Flex verticalAlign="top" className="w-full px-3">
          <Card className="w-full">
            <ThemeSelector />
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
}
