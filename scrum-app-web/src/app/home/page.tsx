'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useRouter } from "next/navigation";
import { MessageSquare, Kanban, Clock } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não houver usuário, o middleware ou header cuidará do redirect no fluxo normal,
  // mas aqui prevenimos renderização
  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Console Principal
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Bem-vindo, {user.name}. Selecione um serviço para começar.
          </p>
        </div> */}

        {/* <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          Serviços de Agilidade
        </h2> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Card de Retrospectivas */}
          <div 
            className="cursor-pointer group"
            role="button"
            tabIndex={0}
            onClick={() => handleNavigate('/retro')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigate('/retro');
              }
            }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow h-full border border-gray-200 dark:border-gray-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-150"></div>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                  <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                    Retrospectivas
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                    Cerimônia de melhoria contínua com votação e ações.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cards de funcionalidades futuras */}
          <div className="opacity-60 cursor-not-allowed grayscale">
            <Card className="p-4 h-full border border-dashed border-gray-300 dark:border-gray-700 bg-transparent">
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                  <Kanban className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-base">
                    Planning Poker
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">
                    Estimativa colaborativa de tarefas e user stories.
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                    Em breve
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="opacity-60 cursor-not-allowed grayscale">
            <Card className="p-4 h-full border border-dashed border-gray-300 dark:border-gray-700 bg-transparent">
               <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                  <Clock className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-base">
                    Daily Standup
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">
                    Sincronização diária rápida e remoção de impedimentos.
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                    Em breve
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
