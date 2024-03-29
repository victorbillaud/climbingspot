import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import SupabaseProvider from '@/components/auth/SupabaseProvider';
import { ColorSchemeProvider } from '@/components/ColorSchemeProvider';
import CookieBanner from '@/components/CookieBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { JobaiProvider } from '@/components/JobaiProvider';
import type { Database } from '@/lib/db_types';
import '@/styles/globals.css';
import { Barlow } from '@next/font/google';
import {
  createServerComponentClient,
  type SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
export type TypedSupabaseClient = SupabaseClient<Database>;

const barlow = Barlow({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-barlow',
});

// do not cache this layout
export const revalidate = 10;

interface IProps {
  children: ReactNode;
}

export const metadata = {
  title: `ClimbingSpot - Communauté d'escalade mondiale - Découvrez, connectez-vous et grimpez ensemble !`,
  description: `Rejoignez ClimbingSpot, la communauté d'escalade en pleine croissance, pour explorer les meilleurs sites d'escalade, rencontrer d'autres grimpeurs et organiser des événements pour grimper ensemble. Commencez votre aventure d'escalade dès aujourd'hui !`,
};

export default async function RootLayout({ children }: IProps) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html lang="en" className={`${barlow.variable}`}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="w-screen h-screen flex justify-center items-center bg-white-200 dark:bg-dark-100">
        <SupabaseProvider accessToken={accessToken as string}>
          <AnalyticsProvider />
          <GoogleAnalytics
            GA_MEASUREMENT_ID="G-8D5GHH2KEL"
            // ADS_MEASUREMENT_ID="AW-11143081114"
          />
          <JobaiProvider>
            <ColorSchemeProvider>
              <div className="h-full w-full">{children}</div>
              <CookieBanner />
            </ColorSchemeProvider>
          </JobaiProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
