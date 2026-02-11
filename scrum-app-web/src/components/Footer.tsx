import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Projeto colaborativo de código aberto</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-center gap-2">
            <span>Colaboradores são bem-vindos!</span>
            <Link
              href="https://github.com/llinq/scrum-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Github className="w-4 h-4" />
              <span>Ver repositório</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
