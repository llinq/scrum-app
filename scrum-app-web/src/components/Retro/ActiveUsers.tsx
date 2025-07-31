"use client";

import { useState } from "react";
import Image from "next/image";
import { ActiveUser } from "../../types/retro";

interface ActiveUsersProps {
  activeUsers: ActiveUser[];
  currentUserId?: string;
}

export default function ActiveUsers({ activeUsers, currentUserId = "user1" }: ActiveUsersProps) {
  const [showAllUsers, setShowAllUsers] = useState(false);

  if (!activeUsers || activeUsers.length === 0) {
    return null;
  }

  const generateAvatar = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Ordenar usuários com o usuário logado sempre primeiro
  const sortedUsers = [...activeUsers].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return 0;
  });

  // Limitar usuários exibidos baseado no estado
  const displayedUsers = showAllUsers ? sortedUsers : sortedUsers.slice(0, 4);

  return (
    <div className="fixed top-3 right-4 z-30">
      <div className="flex flex-col gap-2">
        {displayedUsers.map((user) => (
          <div 
            key={user.id}
            className="group relative"
          >
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white dark:border-gray-800 object-cover shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 ${generateAvatar(user.name)} flex items-center justify-center text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer`}
                >
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {/* Tooltip com nome do usuário */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-40">
              <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {user.name}
                {user.id === currentUserId && " (você)"}
                
                {/* Seta do tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicador de mais usuários ou botão para recolher */}
        {activeUsers.length > 4 && (
          <div className="group relative">
            <div 
              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-500 hover:bg-gray-600 flex items-center justify-center text-white text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => setShowAllUsers(!showAllUsers)}
            >
              {showAllUsers ? '−' : `+${activeUsers.length - 4}`}
            </div>
            
            {/* Tooltip para mais usuários */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-40">
              <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {showAllUsers 
                  ? 'Mostrar menos usuários'
                  : `${activeUsers.length - 4} usuário${activeUsers.length - 4 > 1 ? 's' : ''} adiciona${activeUsers.length - 4 > 1 ? 'is' : 'l'}`
                }
                
                {/* Seta do tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
