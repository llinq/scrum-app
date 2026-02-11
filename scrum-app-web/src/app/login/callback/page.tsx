"use client";

import React, { Suspense, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { isValidCallbackUrl } from "@/lib/url-validation";

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
  }, [token, callbackUrl, processGoogleToken, router]);

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
