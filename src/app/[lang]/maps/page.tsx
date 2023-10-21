import { listMapSpots } from '@/features/spots';
import { Database } from '@/lib/db_types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const Map = dynamic(() => import('@/components/maps/Maps'), { ssr: false });

export const metadata = {
  title: 'Interactive Map - ClimbingSpot',
  description:
    'Discover climbing spots near you with our interactive map page. Browse routes, access detailed spot information, and plan your next climbing adventure. Explore the world of climbing at your fingertips!',
};

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const { spots } = await listMapSpots({
    client: supabase,
  });

  if (!spots) {
    return notFound();
  }

  return (
    <>
      <Map spots={spots} />
    </>
  );
}
