"use client";

import { useState, useEffect } from "react";
import { Plus, Share2, HatGlasses } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RetroBoard, RetroColumn, RetroCard, ActiveUser } from "../../types/retro";
import RetroColumnComponent from "./RetroColumn";
import ActiveUsers from "./ActiveUsers";
import Button from "../Button";
import Card from "../Card";
import Header from "../Header";
import clsx from "clsx";

interface RetroPageProps {
  boardId: string;
}

const MAX_COLUMNS = 4;

export default function RetroPage({ boardId }: RetroPageProps) {
  const [board, setBoard] = useState<RetroBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anonymousMode, setAnonymousMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mock data for development - replace with API calls later
  useEffect(() => {
    const mockActiveUsers: ActiveUser[] = [
      {
        id: "user1",
        name: "João Silva",
        isOnline: true,
        lastSeen: new Date(),
      },
      {
        id: "user2", 
        name: "Maria Santos",
        isOnline: true,
        lastSeen: new Date(),
      },
      {
        id: "user3",
        name: "Carlos Oliveira", 
        isOnline: false,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        id: "user4",
        name: "Ana Costa",
        isOnline: true,
        lastSeen: new Date(),
      },
      {
        id: "user5",
        name: "Pedro Almeida",
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "user6",
        name: "Luciana Ferreira",
        isOnline: true,
        lastSeen: new Date(),
      },
    ];

    const mockBoard: RetroBoard = {
      id: boardId,
      title: "Sprint 1 - Retrospectiva",
      createdBy: "user1",
      createdAt: new Date(),
      activeUsers: mockActiveUsers,
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
            {
              id: "card2",
              content: "Entrega no prazo",
              author: "Maria Santos",
              columnId: "col1",
              createdAt: new Date(),
              votes: 5,
              votedBy: ["user1", "user2", "user3", "user4", "user5"],
            },
          ],
        },
        {
          id: "col2",
          title: "O que pode melhorar?",
          order: 1,
          cards: [
            {
              id: "card3",
              content: "Documentação mais detalhada",
              author: "Carlos Oliveira",
              columnId: "col2",
              createdAt: new Date(),
              votes: 2,
              votedBy: ["user1", "user3"],
            },
          ],
        },
        {
          id: "col3",
          title: "Ações para próxima sprint",
          order: 2,
          cards: [
            {
              id: "card4",
              content: "Implementar testes automatizados",
              author: "Ana Costa",
              columnId: "col3",
              createdAt: new Date(),
              votes: 4,
              votedBy: ["user1", "user2", "user4", "user5"],
            },
          ],
        },
      ],
    };

    setTimeout(() => {
      setBoard(mockBoard);
      setIsLoading(false);
    }, 500);
  }, [boardId]);

  const handleCreateColumn = () => {
    if (!board) return;

    // Validação: impede adicionar mais de 4 colunas
    if (board.columns.length >= MAX_COLUMNS) {
      alert(`Você pode adicionar no máximo ${MAX_COLUMNS} colunas por board.`);
      return;
    }

    const newColumn: RetroColumn = {
      id: `col_${Date.now()}`,
      title: `Nova Coluna ${board.columns.length + 1}`,
      order: board.columns.length,
      cards: [],
    };

    setBoard({
      ...board,
      columns: [...board.columns, newColumn],
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    if (!board) return;

    const newColumns = board.columns.filter((col) => col.id !== columnId);
    setBoard({
      ...board,
      columns: newColumns.map((col, index) => ({ ...col, order: index })),
    });
  };

  const handleUpdateColumn = (
    columnId: string,
    updates: Partial<RetroColumn>
  ) => {
    if (!board) return;

    const newColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, ...updates } : col
    );

    setBoard({
      ...board,
      columns: newColumns,
    });
  };

  const handleCreateCard = (
    columnId: string,
    content: string
  ) => {
    if (!board) return;

    const newCard: RetroCard = {
      id: `card_${Date.now()}`,
      content,
      author: anonymousMode ? "Anônimo" : "João Silva", // Replace with actual user
      columnId,
      createdAt: new Date(),
      votes: 0,
      votedBy: [],
    };

    const newColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    );

    setBoard({
      ...board,
      columns: newColumns,
    });
  };

  const handleDeleteCard = (cardId: string) => {
    if (!board) return;

    const newColumns = board.columns.map((col) => ({
      ...col,
      cards: col.cards.filter((card) => card.id !== cardId),
    }));

    setBoard({
      ...board,
      columns: newColumns,
    });
  };

  const handleVoteCard = (cardId: string) => {
    if (!board) return;

    const newColumns = board.columns.map((col) => ({
      ...col,
      cards: col.cards.map((card) => {
        if (card.id === cardId) {
          const userId = "current-user"; // Replace with actual user ID
          const hasVoted = card.votedBy.includes(userId);

          if (hasVoted) {
            return {
              ...card,
              votes: card.votes - 1,
              votedBy: card.votedBy.filter((id) => id !== userId),
            };
          } else {
            return {
              ...card,
              votes: card.votes + 1,
              votedBy: [...card.votedBy, userId],
            };
          }
        }
        return card;
      }),
    }));

    setBoard({
      ...board,
      columns: newColumns,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !board) return;

    // Only handle column reordering
    if (
      active.data.current?.type === "column" &&
      over.data.current?.type === "column"
    ) {
      const activeIndex = board.columns.findIndex(
        (col) => col.id === active.id
      );
      const overIndex = board.columns.findIndex((col) => col.id === over.id);

      if (activeIndex !== overIndex) {
        const newColumns = arrayMove(board.columns, activeIndex, overIndex);
        const reorderedColumns = newColumns.map((col, index) => ({
          ...col,
          order: index,
        }));

        setBoard({
          ...board,
          columns: reorderedColumns,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Retrospectiva não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            A retrospectiva solicitada não existe ou você não tem permissão para
            acessá-la.
          </p>
        </Card>
      </div>
    );
  }

  const handleShareBoard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copiado para a área de transferência!");
    });
  };

  const handleAnonymousModeToggle = () => {
    const newValue = !anonymousMode;
    
    if (newValue) {
      // Ativando modo anônimo
      if (window.confirm("Tem certeza que deseja ativar o modo anônimo? Todos os novos cards serão criados como anônimos.")) {
        setAnonymousMode(true);
      }
    } else {
      // Desativando modo anônimo
      if (window.confirm("Tem certeza que deseja desativar o modo anônimo? Todos os novos cards mostrarão o autor.")) {
        setAnonymousMode(false);
      }
    }
  };

  const gridColsClass = clsx({
    "grid-cols-1": board.columns.length === 1,
    "grid-cols-2": board.columns.length === 2,
    "grid-cols-3": board.columns.length === 3,
    "grid-cols-4": board.columns.length === 4,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Usuários ativos flutuando */}
      <ActiveUsers activeUsers={board.activeUsers || []} currentUserId="user1" />

      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {board.title}
            </h1>

            <div className="flex items-center gap-3">
              <Button
                variant={anonymousMode ? "secondary" : "outline"}
                size="sm"
                onClick={handleAnonymousModeToggle}
                className={`rounded-full w-10 h-10 p-0 transition-all duration-200 cursor-pointer ${
                  anonymousMode
                    ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                title={
                  anonymousMode
                    ? "Desabilitar modo anônimo"
                    : "Habilitar modo anônimo"
                }
              >
                <HatGlasses className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShareBoard}
                title="Compartilhar link"
                className="rounded-full w-10 h-10 p-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  if (board.columns.length >= MAX_COLUMNS) {
                    alert(
                      `Você pode adicionar no máximo ${MAX_COLUMNS} colunas por board.`
                    );
                    return;
                  }
                  handleCreateColumn();
                }}
                disabled={board.columns.length >= MAX_COLUMNS}
                title={
                  board.columns.length >= MAX_COLUMNS
                    ? `Máximo de ${MAX_COLUMNS} colunas permitidas`
                    : "Adicionar coluna"
                }
                className={`rounded-full w-10 h-10 p-0 ${
                  board.columns.length >= MAX_COLUMNS ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pr-20">
        <div className="px-4 sm:px-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={board.columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className={`gap-6 pb-6 grid ${gridColsClass}`}>
                {board.columns
                  .sort((a, b) => a.order - b.order)
                  .map((column) => (
                    <RetroColumnComponent
                      key={column.id}
                      column={column}
                      onCreateCard={handleCreateCard}
                      onDeleteCard={handleDeleteCard}
                      onVoteCard={handleVoteCard}
                      onDeleteColumn={handleDeleteColumn}
                      onUpdateColumn={handleUpdateColumn}
                      boardSettings={{
                        ...board.settings,
                        allowAnonymous: anonymousMode || board.settings.allowAnonymous
                      }}
                    />
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </main>

    </div>
  );
}
