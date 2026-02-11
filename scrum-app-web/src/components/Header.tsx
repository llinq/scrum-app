'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogOut, User as UserIcon, Home, RotateCcw, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';

export default function Header() {
  const { user, logout } = useAuth();
  const t = useTranslations('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/home" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 shrink-0">
              Scrum App
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/home" 
                className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>{t('home')}</span>
              </Link>
              
              <Link 
                href="/retro" 
                className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('retrospectives')}</span>
              </Link>
            </nav>
          </div>

          {/* Desktop User Info and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.name}
                {user.is_guest && (
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({t('guest')})</span>
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
              <span>{t('logout')}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/home" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>{t('home')}</span>
              </Link>
              
              <Link 
                href="/retro" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <RotateCcw className="w-5 h-5" />
                <span>{t('retrospectives')}</span>
              </Link>

              <div className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-2 pt-4">
                <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm">
                  {user.name}
                  {user.is_guest && (
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({t('guest')})</span>
                  )}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center justify-center space-x-2 mx-3"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
