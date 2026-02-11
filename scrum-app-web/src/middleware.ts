import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from './i18n/config';

function getLocale(request: NextRequest): Locale {
  // 1. Check cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLanguages = acceptLanguage.split(',').map(lang => {
      const parts = lang.split(';')[0].trim();
      return parts;
    });

    for (const browserLang of browserLanguages) {
      // Direct match
      if (locales.includes(browserLang as Locale)) {
        return browserLang as Locale;
      }
      
      // Language code match (e.g., 'pt' matches 'pt-BR')
      const languageCode = browserLang.split('-')[0];
      const matchingLocale = locales.find(locale => 
        locale.startsWith(languageCode)
      );
      
      if (matchingLocale) {
        return matchingLocale;
      }
    }
  }

  // 3. Default
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/home");
  const isRootPage = request.nextUrl.pathname === "/";

  // Detect and set locale
  const locale = getLocale(request);
  const response = NextResponse.next();
  
  // Set locale cookie if not set
  if (!request.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
    });
  }

  // Se está tentando acessar uma página protegida sem token
  if (isProtectedPage && !token) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    if (!request.cookies.get('NEXT_LOCALE')) {
      redirectResponse.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      });
    }
    return redirectResponse;
  }

  // Se está autenticado e tentando acessar login ou root, redireciona para /home
  if (token && (isAuthPage || isRootPage)) {
    const redirectResponse = NextResponse.redirect(new URL("/home", request.url));
    if (!request.cookies.get('NEXT_LOCALE')) {
      redirectResponse.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      });
    }
    return redirectResponse;
  }

  // Se está na raiz sem token, redireciona para login
  if (isRootPage && !token) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    if (!request.cookies.get('NEXT_LOCALE')) {
      redirectResponse.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      });
    }
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
