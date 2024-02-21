'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Flex } from './common';

export default function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);

  useEffect(() => {
    // Ensure localStorage is accessed only on the client side
    if (typeof window !== 'undefined') {
      const storedCookieConsent = getLocalStorage('cookie_consent', null);
      setCookieConsent(storedCookieConsent);
    }
  }, []);

  useEffect(() => {
    // Guard to ensure code runs only on the client side
    if (typeof window !== 'undefined' && cookieConsent !== null) {
      const newValue = cookieConsent ? 'granted' : 'denied';

      // Example of updating consent; ensure this code runs only client-side
      window.gtag('consent', 'update', {
        analytics_storage: newValue,
      });

      setLocalStorage('cookie_consent', cookieConsent);
      console.log('Cookie Consent: ', cookieConsent);
    }
  }, [cookieConsent]);

  function getLocalStorage(key: string, defaultValue: any) {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return defaultValue;
    }
  }

  function setLocalStorage(key: string, value: any) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }

  return (
    <Flex
      direction="row"
      className={`fixed bottom-0 w-full bg-white-100 dark:bg-dark-300 p-2 border-t border-white-300 dark:border-dark-300 z-50 ${
        cookieConsent !== null ? 'hidden' : 'flex'
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
