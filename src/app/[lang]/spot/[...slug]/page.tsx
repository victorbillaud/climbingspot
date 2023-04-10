import { logger } from '@supabase/auth-helpers-nextjs';

export default async function Page({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  const { slug } = params;
  logger.debug('slug', slug);

  return <div>Slug</div>;
}
