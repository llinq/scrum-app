"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  ArrowRight,
  Settings,
  Trash2,
} from "lucide-react";
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
        console.error("Erro ao carregar boards:", err);
        setError("Erro ao carregar retrospectivas. Tente novamente.");
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
      console.error("Erro ao criar retrospectiva:", error);
      setError("Erro ao criar retrospectiva. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBoard = async (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();

    if (
      confirm(
        "Tem certeza que deseja excluir esta retrospectiva? Todos os dados serão perdidos.",
      )
    ) {
      try {
        await retroService.deleteBoard(boardId);
        setBoards((prev) => prev.filter((b) => b.id !== boardId));
      } catch (err) {
        console.error("Erro ao excluir retrospectiva:", err);
        alert("Erro ao excluir retrospectiva. Tente novamente.");
      }
    }
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
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Retrospectivas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                Gerencie e visualize suas retrospectivas de sprint
              </p>
            </div>

            <Button onClick={handleCreateBoard} className="w-full sm:w-auto">
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
                  Crie sua primeira retrospectiva para começar a coletar
                  feedback da equipe.
                </p>
                <Button onClick={handleCreateBoard}>
                  <Plus className="w-5 h-5" />
                  Criar primeira retrospectiva
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      <button
                        className="cursor-pointer text-gray-400 hover:text-red-500 "
                        onClick={(e) => handleDeleteBoard(e, board.id)}
                        title="Excluir retrospectiva"
                        aria-label="Excluir retrospectiva"
                      >
                        <Trash2 className="w-4 h-4x" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(board.created_at).toLocaleDateString()}
                        </span>
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
