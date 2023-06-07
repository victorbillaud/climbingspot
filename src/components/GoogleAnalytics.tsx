'use client';

import { pageview } from '@/lib';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
  ADS_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
  ADS_MEASUREMENT_ID: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();

    pageview(GA_MEASUREMENT_ID, url);
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-ads"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_MEASUREMENT_ID}`}
      />
      <Script
        id="google-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '${ADS_MEASUREMENT_ID}');
          `,
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });
                
                gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                });
                `,
        }}
      />
      <Script
        id="google-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          gtag('event', 'conversion', {'send_to': '${ADS_MEASUREMENT_ID}/BsHPCLTo36gYEJrZt8Ep'});
          `,
        }}
      />
    </>
  );
}
