import { listSpotsSlugs } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';
import { ISitemapField, getServerSideSitemap } from 'next-sitemap';

export async function GET(request: Request) {
  const supabase = createClient();
  const { slugs } = await listSpotsSlugs({
    client: supabase,
  });

  const spotsPaths: ISitemapField[] = slugs.map((slug) => ({
    loc: `https://climbingspot.eu${slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.7,
    alternateRefs: [
      {
        hreflang: 'en',
        href: `https://climbingspot.eu/en${slug}`,
      },
      {
        hreflang: 'fr',
        href: `https://climbingspot.eu/fr${slug}`,
      },
    ],
  }));

  // extract from spotsPaths the paths like /spot/france/paris and /spot/france/lyon
  const paths: ISitemapField[] = [];

  spotsPaths.forEach((spotPath) => {
    const path = spotPath.loc.split('https://climbingspot.eu')[1];
    const pathArray = path.split('/');
    const country = pathArray[2];
    const city = pathArray[3];
    const countryPath = `/spot/${country}`;
    const cityPath = `/spot/${country}/${city}`;

    paths.push({
      loc: `https://climbingspot.eu${countryPath}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
      alternateRefs: [
        {
          hreflang: 'en',
          href: `https://climbingspot.eu/en${countryPath}`,
        },
        {
          hreflang: 'fr',
          href: `https://climbingspot.eu/fr${countryPath}`,
        },
      ],
    });

    paths.push({
      loc: `https://climbingspot.eu${cityPath}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
      alternateRefs: [
        {
          hreflang: 'en',
          href: `https://climbingspot.eu/en${cityPath}`,
        },
        {
          hreflang: 'fr',
          href: `https://climbingspot.eu/fr${cityPath}`,
        },
      ],
    });
  });

  // remove duplicates
  const uniquePaths = paths.filter(
    (thing, index, self) =>
      index === self.findIndex((t) => t.loc === thing.loc),
  );

  return getServerSideSitemap([...spotsPaths, ...uniquePaths]);
}
