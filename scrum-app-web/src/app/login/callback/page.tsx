"use client";

import React, { Suspense, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

// Validate callback URL to prevent open redirect vulnerability
function isValidCallbackUrl(url: string): boolean {
  // Must be a relative path starting with /
  if (!url.startsWith('/')) {
    return false;
  }
  
  // Must not contain // (to prevent protocol-relative URLs like //evil.com)
  if (url.includes('//')) {
    return false;
  }
  
  // Must not contain backslashes (to prevent bypass attempts)
  if (url.includes('\\')) {
    return false;
  }
  
  return true;
}

function LoginCallback() {
  const { processGoogleToken, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  // Validate and sanitize callbackUrl to prevent open redirect
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/home";
  const callbackUrl = isValidCallbackUrl(rawCallbackUrl) ? rawCallbackUrl : "/home";

  useEffect(() => {
    if (token) {
      processGoogleToken(token).then(() => {
        // Redireciona para a URL original ou /home
        router.replace(callbackUrl);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
}

export default function LoginCallbackPage() {
  return (
    <Suspense>
      <LoginCallback />
    </Suspense>
  );
}
