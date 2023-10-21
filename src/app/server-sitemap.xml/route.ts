import { listSpotsSlugs } from '@/features/spots';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { slugs } = await listSpotsSlugs({
    client: supabase,
  });

  const spotsPaths: ISitemapField[] = slugs.map((slug) => ({
    loc: `https://www.climbingspot.eu/fr${slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.7,
    alternateRefs: [
      {
        hreflang: 'en',
        href: `https://www.climbingspot.eu/en${slug}`,
      },
      {
        hreflang: 'fr',
        href: `https://www.climbingspot.eu/fr${slug}`,
      },
    ],
  }));

  // extract from spotsPaths the paths like /spot/france/paris and /spot/france/lyon
  const paths: ISitemapField[] = [];

  slugs.forEach((slug) => {
    const path = slug?.split('/')?.slice(0, 4)?.join('/');
    console.log(path);
    if (path) {
      paths.push({
        loc: `https://www.climbingspot.eu/fr${path}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.7,
        alternateRefs: [
          {
            hreflang: 'en',
            href: `https://www.climbingspot.eu/en${path}`,
          },
          {
            hreflang: 'fr',
            href: `https://www.climbingspot.eu/fr${path}`,
          },
        ],
      });
    }
  });

  // remove duplicates
  const uniquePaths = paths.filter(
    (thing, index, self) =>
      index === self.findIndex((t) => t.loc === thing.loc),
  );

  return getServerSideSitemap([...uniquePaths, ...spotsPaths]);
}
