"use client";

import React, { Suspense, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

function LoginCallback() {
  const { processGoogleToken, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      processGoogleToken(token).then(() => {
        // Remove o token da URL após processar
        router.replace("/dashboard");
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
