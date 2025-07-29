'use client';

import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/Button';

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Scrum App
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.name}
                {user.is_guest && (
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(Convidado)</span>
                )}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
