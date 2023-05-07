'use client';

import { getLocalStorage, setLocalStorage } from '@/lib';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Flex } from './common';

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(
    getLocalStorage('cookie_consent', null),
  );

  useEffect(() => {
    const storedCookieConsent = getLocalStorage('cookie_consent', null);

    setCookieConsent(storedCookieConsent);
  }, [setCookieConsent]);

  useEffect(() => {
    const newValue = cookieConsent ? 'granted' : 'denied';

    window.gtag('consent', 'update', {
      analytics_storage: newValue,
    });

    setLocalStorage('cookie_consent', cookieConsent);

    //For Testing
    console.log('Cookie Consent: ', cookieConsent);
  }, [cookieConsent]);

  return (
    <Flex
      direction="row"
      className={`fixed bottom-0 w-full bg-white-100 dark:bg-dark-300 p-2 border-t border-white-300 dark:border-dark-300 z-50 ${
        cookieConsent != null ? 'hidden' : 'block'
      }`}
    >
      <div className="text-center">
        <Link href="/info/cookies">
          <p>
            We use <span className="font-bold text-brand-400">cookies</span> on
            our site.
          </p>
        </Link>
      </div>

      <Flex direction="row" gap={0}>
        <Button
          variant="primary"
          text="Decline"
          onClick={() => setCookieConsent(false)}
        />
        <Button
          variant="secondary"
          text="Accept"
          onClick={() => setCookieConsent(true)}
        />
      </Flex>
    </Flex>
  );
}
