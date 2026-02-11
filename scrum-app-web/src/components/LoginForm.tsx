'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card, { CardHeader, CardContent } from '@/components/Card';
import { authService } from '@/services/auth';
import { useAuth } from '@/lib/auth-context';

const guestSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});

type GuestFormData = z.infer<typeof guestSchema>;

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

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  
  // Validate and sanitize callbackUrl to prevent open redirect
  const rawCallbackUrl = searchParams.get('callbackUrl') || '/home';
  const callbackUrl = isValidCallbackUrl(rawCallbackUrl) ? rawCallbackUrl : '/home';

  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const handleGuestAccess = async (data: GuestFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.createGuestUser(data);
      setUser(response.user);
      router.push(callbackUrl);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao acessar como convidado');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Passa o callbackUrl como state para ser recuperado após o OAuth
    const googleAuthUrl = new URL(`${apiUrl}/auth/google`);
    if (callbackUrl !== '/home') {
      googleAuthUrl.searchParams.set('state', encodeURIComponent(callbackUrl));
    }
    window.location.href = googleAuthUrl.toString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Scrum App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Entre com Google ou continue como convidado
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
              Acesse sua conta
            </h3>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-4 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            {/* Opção 1: OAuth (Google) */}
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>

            {/* Divisor */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  ou continue como convidado
                </span>
              </div>
            </div>

            {/* Opção 2: Convidado */}
            <form onSubmit={guestForm.handleSubmit(handleGuestAccess)} className="space-y-4">
              <Input
                label="Seu nome"
                type="text"
                placeholder="Como você gostaria de ser chamado?"
                {...guestForm.register('name')}
                error={guestForm.formState.errors.name?.message}
              />
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                variant="secondary"
              >
                Acessar como convidado
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
