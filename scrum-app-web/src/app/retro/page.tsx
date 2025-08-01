"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar, Users, ArrowRight, Settings } from "lucide-react";
import { RetroBoard } from "../../types/retro";
import { retroService } from "../../services/retro";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Header from "@/components/Header";
import CreateRetroModal from "../../components/CreateRetroModal";

export default function RetroListPage() {
  const [boards, setBoards] = useState<RetroBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load boards from API
  useEffect(() => {
    const loadBoards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const boardsData = await retroService.getMyBoards();
        setBoards(boardsData);
      } catch (err) {
        console.error('Erro ao carregar boards:', err);
        setError('Erro ao carregar retrospectivas. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBoards();
  }, []);

  const handleCreateBoard = () => {
    setShowCreateModal(true);
  };

  const handleCreateRetro = async (retroName: string) => {
    setIsCreating(true);
    
    try {
      const newBoard = await retroService.createBoard({
        title: retroName,
        allow_voting: true,
        max_votes_per_user: 5,
        show_author: true,
        allow_anonymous: false,
      });

      setBoards((prev) => [newBoard, ...prev]);
      setShowCreateModal(false);
      
      // Navigate to the new board
      router.push(`/retro/${newBoard.id}`);
    } catch (error) {
      console.error('Erro ao criar retrospectiva:', error);
      setError('Erro ao criar retrospectiva. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const getTotalCards = (board: RetroBoard) => {
    return board.columns?.reduce((total, col) => total + (col.cards?.length || 0), 0) || 0;
  };

  const getTotalVotes = (board: RetroBoard) => {
    return board.columns
      ?.flatMap((col) => col.cards || [])
      .reduce((total, card) => total + (card?.votes_count || 0), 0) || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="flex items-center justify-center min-h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Card className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Erro ao carregar retrospectivas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Tentar novamente
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Retrospectivas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie e visualize suas retrospectivas de sprint
              </p>
            </div>

            <Button onClick={handleCreateBoard}>
              <Plus className="w-5 h-5" />
              Nova Retrospectiva
            </Button>
          </div>

          {/* Boards Grid */}
          {boards.length === 0 ? (
            <Card className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Settings className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Nenhuma retrospectiva ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Crie sua primeira retrospectiva para começar a coletar feedback
                  da equipe.
                </p>
                <Button onClick={handleCreateBoard}>
                  <Plus className="w-5 h-5" />
                  Criar primeira retrospectiva
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="cursor-pointer group"
                  onClick={() => router.push(`/retro/${board.id}`)}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {board.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(board.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{board.columns?.length || 0} colunas</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {getTotalCards(board)} cards
                        </span>
                        {board.allow_voting && (
                          <span className="text-gray-600 dark:text-gray-400">
                            {getTotalVotes(board)} votos
                          </span>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal para criação de retrospectiva */}
      <CreateRetroModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRetro}
        loading={isCreating}
      />
    </div>
  );
}
