import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <span>Projeto colaborativo</span>
          <Heart className="w-3 h-3 text-red-500" />
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <Link
            href="https://github.com/llinq/scrum-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Github className="w-3 h-3" />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
