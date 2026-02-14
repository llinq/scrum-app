'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/i18n/locale-context';
import { locales, type Locale } from '@/i18n/config';
import { Github, Heart, Languages } from 'lucide-react';

const localeNames: Record<Locale, string> = {
  'pt-BR': 'Português (BR)',
  'en-US': 'English (US)',
};

export default function Footer() {
  const t = useTranslations('footer');
  const { locale, setLocale } = useLocale();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>{t('collaborativeProject')}</span>
            <Heart className="w-3 h-3 text-red-500" />
          </div>
          
          <span className="hidden sm:inline text-gray-400 dark:text-gray-500">•</span>
          
          <Link
            href="https://github.com/llinq/scrum-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Github className="w-3 h-3" />
            <span>GitHub</span>
          </Link>
          
          <span className="hidden sm:inline text-gray-400 dark:text-gray-500">•</span>
          
          <div className="flex items-center gap-1.5">
            <Languages className="w-3 h-3" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              aria-label={t('selectLanguage')}
            >
              {locales.map((loc) => (
                <option key={loc} value={loc}>
                  {localeNames[loc]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
