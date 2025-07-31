"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar, Users, ArrowRight, Settings } from "lucide-react";
import { RetroBoard } from "../../types/retro";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Header from "@/components/Header";

export default function RetroListPage() {
  const [boards, setBoards] = useState<RetroBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock data for development
  useEffect(() => {
    const mockBoards: RetroBoard[] = [
      {
        id: "1",
        title: "Sprint 1 - Retrospectiva",
        description: "Retrospectiva da primeira sprint do projeto",
        isActive: true,
        createdBy: "user1",
        createdAt: new Date("2025-01-15"),
        settings: {
          allowVoting: true,
          maxVotesPerUser: 5,
          showAuthor: true,
          allowAnonymous: false,
        },
        columns: [
          {
            id: "col1",
            title: "O que foi bem?",
            color: "bg-green-100 border-green-300",
            order: 0,
            cards: [
              {
                id: "card1",
                content: "Boa comunicação da equipe",
                author: "João Silva",
                columnId: "col1",
                createdAt: new Date(),
                votes: 3,
                votedBy: ["user1", "user2", "user3"],
              },
            ],
          },
        ],
      },
      {
        id: "2",
        title: "Sprint 2 - Retrospectiva",
        description: "Retrospectiva da segunda sprint",
        isActive: false,
        createdBy: "user1",
        createdAt: new Date("2025-01-01"),
        settings: {
          allowVoting: true,
          maxVotesPerUser: 3,
          showAuthor: false,
          allowAnonymous: true,
        },
        columns: [],
      },
    ];

    setTimeout(() => {
      setBoards(mockBoards);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCreateBoard = () => {
    // In a real app, this would open a modal or navigate to a create page
    const newBoard: RetroBoard = {
      id: `board_${Date.now()}`,
      title: `Retrospectiva ${new Date().toLocaleDateString()}`,
      description: "",
      isActive: true,
      createdBy: "current-user",
      createdAt: new Date(),
      settings: {
        allowVoting: true,
        maxVotesPerUser: 5,
        showAuthor: true,
        allowAnonymous: false,
      },
      columns: [
        {
          id: "col1",
          title: "O que foi bem?",
          color: "bg-green-100 border-green-300",
          order: 0,
          cards: [],
        },
        {
          id: "col2",
          title: "O que pode melhorar?",
          color: "bg-yellow-100 border-yellow-300",
          order: 1,
          cards: [],
        },
        {
          id: "col3",
          title: "Ações para próxima sprint",
          color: "bg-blue-100 border-blue-300",
          order: 2,
          cards: [],
        },
      ],
    };

    setBoards((prev) => [newBoard, ...prev]);
    router.push(`/retro/${newBoard.id}`);
  };

  const getTotalCards = (board: RetroBoard) => {
    return board.columns.reduce((total, col) => total + col.cards.length, 0);
  };

  const getTotalVotes = (board: RetroBoard) => {
    return board.columns
      .flatMap((col) => col.cards)
      .reduce((total, card) => total + card.votes, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
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
                      {board.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {board.description}
                        </p>
                      )}
                    </div>

                    <div
                      className={`
                      w-3 h-3 rounded-full flex-shrink-0 ml-2
                      ${
                        board.isActive
                          ? "bg-green-400"
                          : "bg-gray-300 dark:bg-gray-600"
                      }
                    `}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{board.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{board.columns.length} colunas</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {getTotalCards(board)} cards
                      </span>
                      {board.settings.allowVoting && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {getTotalVotes(board)} votos
                        </span>
                      )}
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                  </div>

                  {!board.isActive && (
                    <div className="mt-3 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md inline-block">
                      Finalizada
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
