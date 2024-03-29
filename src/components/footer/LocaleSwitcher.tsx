'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { i18n } from '../../i18n';
import { Flex, Text } from '../common';
import { useDictionary } from '../DictionaryProvider';

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const params = useSearchParams();

  const redirectedPathName = (locale: string) => {
    if (!pathName) return `/`;
    const segments = pathName.split('/');
    segments[1] = locale;
    return `${segments.join('/')}?${params.toString()}`;
  };

  const dictionary = useDictionary();

  return (
    <Flex direction="row">
      {i18n.locales.map((locale) => {
        return (
          <Link key={locale} href={redirectedPathName(locale)}>
            <Text variant="caption">{dictionary.locales[locale]}</Text>
          </Link>
        );
      })}
    </Flex>
  );
}
