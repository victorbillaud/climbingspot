import { listSpotsSlugs } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';
import { getServerSideSitemap } from 'next-sitemap';

export async function GET(request: Request) {
  const supabase = createClient();
  const { slugs } = await listSpotsSlugs({
    client: supabase,
  });

  const paths = slugs.map((slug) => ({
    loc: `https://climbingspot.eu${slug}`,
    lastmod: new Date().toISOString(),
  }));

  return getServerSideSitemap(paths);
}
