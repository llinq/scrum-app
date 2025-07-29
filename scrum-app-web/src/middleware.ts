import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isRootPage = request.nextUrl.pathname === '/';

  // Se está tentando acessar uma página protegida sem token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se está autenticado e tentando acessar login ou root, redireciona para dashboard
  if (token && (isAuthPage || isRootPage)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se está na raiz sem token, redireciona para login
  if (isRootPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
