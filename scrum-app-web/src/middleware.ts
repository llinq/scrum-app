import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/home") || 
                          request.nextUrl.pathname.startsWith("/retro");
  const isRootPage = request.nextUrl.pathname === "/";

  // Se está tentando acessar uma página protegida sem token
  if (isProtectedPage && !token) {
    const loginUrl = new URL("/login", request.url);
    // Salva a URL que o usuário tentou acessar
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se está autenticado e tentando acessar login ou root, redireciona para /home
  if (token && (isAuthPage || isRootPage)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Se está na raiz sem token, redireciona para login
  if (isRootPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
