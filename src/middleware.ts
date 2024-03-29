import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { i18n } from './i18n';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import Negotiator from 'negotiator';
import { Database } from './lib/db_types';

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  try {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Use negotiator and intl-localematcher to get best locale
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales;
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return undefined;
  }
}

function getLocaleFromReferer(request: NextRequest): string | undefined {
  const referer = request.headers.get('referer');
  if (!referer) return undefined;

  const refererUrl = new URL(referer);
  const refererPath = refererUrl.pathname;

  // Check if there is any supported locale in the referer
  const refererIsMissingLocale = i18n.locales.every(
    (locale) =>
      !refererPath.startsWith(`/${locale}/`) && refererPath !== `/${locale}`,
  );

  // If there is no locale in the referer, we can't get the locale from it
  if (refererIsMissingLocale) return undefined;

  // Get the locale from the referer
  const refererLocale = refererPath.split('/')[1];
  return refererLocale;
}

async function handleInternationalization(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromReferer(request) || getLocale(request);

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(
        `/${locale}/${pathname}${request.nextUrl.search}`,
        request.nextUrl.origin,
      ),
    );
  }

  return null;
}

async function handleSupabaseSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromReferer(request) || getLocale(request);
  const res = NextResponse.next();

  const supabase = createMiddlewareClient<Database>({
    req: request,
    res,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if ((!session || !user) && pathname.startsWith(`/${locale}/settings`)) {
    const redirectUrl = new URL(
      `${getLocale(request)}/auth/login`,
      request.nextUrl.origin,
    );
    redirectUrl.searchParams.set('redirect', request.nextUrl.clone().href);
    return NextResponse.redirect(redirectUrl);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const internationalizationResponse = await handleInternationalization(
    request,
  );
  if (internationalizationResponse) return internationalizationResponse;

  const supabaseSessionResponse = await handleSupabaseSession(request);
  if (supabaseSessionResponse) return supabaseSessionResponse;

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
