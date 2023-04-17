import { listMapSpots } from '@/features/spots';
import { createClient } from '@/lib/supabase/server';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const Map = dynamic(() => import('@/components/maps/Maps'), { ssr: false });

export const metadata = {
  title: 'Interactive Map - ClimbingSpot',
  description:
    'Discover climbing spots near you with our interactive map page. Browse routes, access detailed spot information, and plan your next climbing adventure. Explore the world of climbing at your fingertips!',
};

export default async function Page() {
  const supabase = createClient();
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
