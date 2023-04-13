import { listSpotsSlugs } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';
import { getServerSideSitemap } from 'next-sitemap';

export async function GET(request: Request) {
  const supabase = createClient();
  const { slugs } = await listSpotsSlugs({
    client: supabase,
  });

  const spotsPaths = slugs.map((slug) => ({
    loc: `https://climbingspot.eu${slug}`,
    lastmod: new Date().toISOString(),
  }));

  // extract from spotsPaths the paths like /spot/france/paris and /spot/france/lyon
  const paths: { loc: string; lastmod: string }[] = [];

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
    });

    paths.push({
      loc: `https://climbingspot.eu${cityPath}`,
      lastmod: new Date().toISOString(),
    });
  });

  // remove duplicates
  const uniquePaths = paths.filter(
    (thing, index, self) =>
      index === self.findIndex((t) => t.loc === thing.loc),
  );

  return getServerSideSitemap([...spotsPaths, ...uniquePaths]);
}
