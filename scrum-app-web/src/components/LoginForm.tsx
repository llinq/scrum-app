'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { authService } from '@/services/auth';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const guestSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type GuestFormData = z.infer<typeof guestSchema>;

export function LoginForm() {
  const [mode, setMode] = useState<'login' | 'guest'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(data);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async (data: GuestFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.createGuestUser(data);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erro ao acessar como convidado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Scrum App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Faça login ou acesse como convidado
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex space-x-4">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 px-4 text-center rounded-md transition-colors ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('guest')}
                className={`flex-1 py-2 px-4 text-center rounded-md transition-colors ${
                  mode === 'guest'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                }`}
              >
                Convidado
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-4 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  {...loginForm.register('email')}
                  error={loginForm.formState.errors.email?.message}
                />
                <Input
                  label="Senha"
                  type="password"
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message}
                />
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  Entrar
                </Button>
              </form>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
