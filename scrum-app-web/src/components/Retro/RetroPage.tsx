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
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { RetroBoard, RetroColumn, RetroCard } from "../../types/retro";
import { retroService } from "../../services/retro";
import RetroColumnComponent from "./RetroColumn";
import ActiveUsers from "./ActiveUsers";
import Button from "../Button";
import Card from "../Card";
import Header from "../Header";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";

interface RetroPageProps {
  boardId: string;
}

const MAX_COLUMNS = 4;

export default function RetroPage({ boardId }: RetroPageProps) {
  const [board, setBoard] = useState<RetroBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anonymousMode, setAnonymousMode] = useState(false);

  const { user } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load board data from API
  useEffect(() => {
    // Utility function to load board data
    const loadBoardData = async () => {
      // Load board details
      const boardData = await retroService.getBoard(boardId);

      // Load columns for the board
      const columnsData = await retroService.getColumnsByBoard(boardId);

      // Load cards for each column and attach to columns
      const columnsWithCards = await Promise.all(
        columnsData.map(async (column) => {
          const cards = await retroService.getCardsByColumn(column.id);
          return {
            ...column,
            cards: cards || [],
          };
        })
      );

      // Sort columns by order_index
      const sortedColumns = columnsWithCards.sort(
        (a, b) => a.order_index - b.order_index
      );

      return {
        ...boardData,
        columns: sortedColumns,
        activeUsers: [], // TODO: Implement real-time active users later
      };
    };

    const loadBoard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const boardData = await loadBoardData();
        setBoard(boardData);
      } catch (err) {
        console.error("Erro ao carregar board:", err);
        setError("Erro ao carregar retrospectiva. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    if (boardId) {
      loadBoard();
    }
  }, [boardId]);

  const handleCreateColumn = async () => {
    if (!board || !board.columns) return;

    // Validação: impede adicionar mais de 4 colunas
    if (board.columns.length >= MAX_COLUMNS) {
      alert(`Você pode adicionar no máximo ${MAX_COLUMNS} colunas por board.`);
      return;
    }

    // Create a temporary column for optimistic UI
    const tempColumn: RetroColumn = {
      id: `temp-${Date.now()}`, // Temporary ID
      board_id: boardId,
      title: `Nova Coluna ${board.columns.length + 1}`,
      order_index: board.columns.length,
      created_at: new Date(),
      updated_at: new Date(),
      cards: [],
    };

    try {
      // Update local state immediately for optimistic UI
      setBoard((prevBoard) => {
        if (!prevBoard) return prevBoard;

        return {
          ...prevBoard,
          columns: [...(prevBoard.columns || []), tempColumn],
        };
      });

      const columnData = {
        title: `Nova Coluna ${board.columns.length + 1}`,
        orderIndex: board.columns.length,
      };

      const newColumn = await retroService.createColumn(boardId, columnData);

      // Replace temporary column with the real column from API
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns.map(col =>
          col.id === tempColumn.id ? { ...newColumn, cards: [] } : col
        );

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });
    } catch (error) {
      console.error("Erro ao criar coluna:", error);
      
      // Remove temporary column on API error
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const revertedColumns = prevBoard.columns.filter(col => col.id !== tempColumn.id);

        return {
          ...prevBoard,
          columns: revertedColumns,
        };
      });
      
      // TODO: Show error message to user
      alert("Erro ao criar coluna. Tente novamente.");
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!board) return;

    // Store original columns for potential rollback
    const originalColumns = [...(board.columns || [])];
    const columnToDelete = originalColumns.find(col => col.id === columnId);
    
    if (!columnToDelete) return;

    try {
      // Update local state immediately for optimistic UI
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns
          .filter((col) => col.id !== columnId)
          .map((col, index) => ({ ...col, order_index: index }));

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });

      await retroService.deleteColumn(columnId);
    } catch (error) {
      console.error("Erro ao deletar coluna:", error);
      
      // Revert to original state on API error
      setBoard((prevBoard) => {
        if (!prevBoard) return prevBoard;
        return {
          ...prevBoard,
          columns: originalColumns,
        };
      });
      
      // TODO: Show error message to user
      alert("Erro ao deletar coluna. Tente novamente.");
    }
  };

  const handleUpdateColumn = async (
    columnId: string,
    updates: Partial<RetroColumn>
  ) => {
    if (!board) return;

    // Store original column data for potential rollback
    const originalColumn = board.columns?.find(col => col.id === columnId);
    if (!originalColumn) return;

    try {
      // Update local state immediately for optimistic UI
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns.map((col) =>
          col.id === columnId ? { ...col, ...updates } : col
        );

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });

      const updateData = {
        title: updates.title,
        orderIndex: updates.order_index,
      };

      const updatedColumn = await retroService.updateColumn(
        columnId,
        updateData
      );

      // Update local state with the API response to ensure consistency
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns.map((col) =>
          col.id === columnId ? { ...col, ...updatedColumn } : col
        );

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });
    } catch (error) {
      console.error("Erro ao atualizar coluna:", error);
      
      // Revert to original state on API error
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const revertedColumns = prevBoard.columns.map((col) =>
          col.id === columnId ? originalColumn : col
        );

        return {
          ...prevBoard,
          columns: revertedColumns,
        };
      });
      
      // TODO: Show error message to user
      alert("Erro ao atualizar coluna. Tente novamente.");
    }
  };

  const handleCreateCard = async (columnId: string, content: string) => {
    if (!board) return;

    // Create a temporary card for optimistic UI
    const tempCard: RetroCard = {
      id: `temp-${Date.now()}`, // Temporary ID
      column_id: columnId,
      content,
      author_id: user?.id || null,
      author_name: user?.name ?? 'Anônimo',
      is_anonymous: false,
      votes_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      // Update local state immediately for optimistic UI
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns.map((col) =>
          col.id === columnId
            ? { ...col, cards: [...(col.cards || []), tempCard] }
            : col
        );

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });

      const cardData = {
        content,
        author_name: user?.name ?? 'Anônimo',
      };

      const newCard = await retroService.createCard(columnId, cardData);

      // Replace temporary card with the real card from API
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns.map((col) =>
          col.id === columnId
            ? { 
                ...col, 
                cards: col.cards?.map(card => 
                  card.id === tempCard.id ? newCard : card
                ) || [newCard]
              }
            : col
        );

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });
    } catch (error) {
      console.error("Erro ao criar card:", error);
      
      // Remove temporary card on API error
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const revertedColumns = prevBoard.columns.map((col) =>
          col.id === columnId
            ? { 
                ...col, 
                cards: col.cards?.filter(card => card.id !== tempCard.id) || []
              }
            : col
        );

        return {
          ...prevBoard,
          columns: revertedColumns,
        };
      });
      
      // TODO: Show error message to user
      alert("Erro ao criar card. Tente novamente.");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!board) return;

    // Find the original card and its column for potential rollback
    let originalCard: RetroCard | undefined;
    let originalColumnId: string | undefined;
    
    board.columns?.forEach(col => {
      const card = col.cards?.find(c => c.id === cardId);
      if (card) {
        originalCard = card;
        originalColumnId = col.id;
      }
    });

    if (!originalCard || !originalColumnId) return;

    try {
      // Update local state immediately for optimistic UI
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns.map((col) => ({
          ...col,
          cards: col.cards?.filter((card) => card.id !== cardId) || [],
        }));

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });

      await retroService.deleteCard(cardId);
    } catch (error) {
      console.error("Erro ao deletar card:", error);
      
      // Revert to original state on API error
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const revertedColumns = prevBoard.columns.map((col) => ({
          ...col,
          cards: col.id === originalColumnId 
            ? [...(col.cards || []), originalCard!]
            : col.cards || [],
        }));

        return {
          ...prevBoard,
          columns: revertedColumns,
        };
      });
      
      // TODO: Show error message to user
      alert("Erro ao deletar card. Tente novamente.");
    }
  };

  const handleVoteCard = async (cardId: string) => {
    if (!board) return;

    // Find the original card for potential rollback
    let originalCard: RetroCard | undefined;
    board.columns?.forEach(col => {
      const card = col.cards?.find(c => c.id === cardId);
      if (card) originalCard = card;
    });

    if (!originalCard) return;

    try {
      // Update local state immediately for optimistic UI
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const updatedColumns = prevBoard.columns.map((col) => ({
          ...col,
          cards:
            col.cards?.map((card) =>
              card.id === cardId
                ? { ...card, votes_count: card.votes_count + 1 }
                : card
            ) || [],
        }));

        return {
          ...prevBoard,
          columns: updatedColumns,
        };
      });

      // TODO: Implement vote checking logic with user votes
      // For now, we'll always add votes
      await retroService.addVote(cardId);
    } catch (error) {
      console.error("Erro ao votar no card:", error);
      
      // Revert to original state on API error
      setBoard((prevBoard) => {
        if (!prevBoard || !prevBoard.columns) return prevBoard;

        const revertedColumns = prevBoard.columns.map((col) => ({
          ...col,
          cards:
            col.cards?.map((card) =>
              card.id === cardId ? originalCard! : card
            ) || [],
        }));

        return {
          ...prevBoard,
          columns: revertedColumns,
        };
      });
      
      // TODO: Show error message to user
      alert("Erro ao votar no card. Tente novamente.");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !board || !board.columns) return;

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
        // Store original columns for potential rollback
        const originalColumns = [...board.columns];
        
        // Calculate reordered columns
        const reorderedColumns = arrayMove(board.columns, activeIndex, overIndex);

        try {
          // Update local state immediately for optimistic UI
          setBoard((prevBoard) => {
            if (!prevBoard || !prevBoard.columns) return prevBoard;
            
            // Update order_index for each column to match new positions
            const updatedColumns = reorderedColumns.map((col, index) => ({
              ...col,
              order_index: index,
            }));

            console.log("Reordered columns:", updatedColumns);

            return {
              ...prevBoard,
              columns: updatedColumns,
            };
          });

          // Create the column IDs array in the new order
          const columnIds = reorderedColumns.map((col) => col.id);

          // Call API to persist the new order
          await retroService.reorderColumns(board.id, { columnIds });
        } catch (error) {
          console.error("Erro ao reordenar colunas:", error);
          
          // Revert to original state on API error
          setBoard((prevBoard) => {
            if (!prevBoard) return prevBoard;
            return {
              ...prevBoard,
              columns: originalColumns,
            };
          });
          
          // TODO: Show error message to user
          alert("Erro ao reordenar colunas. Tente novamente.");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Erro ao carregar retrospectiva
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Retrospectiva não encontrada
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              A retrospectiva solicitada não existe ou você não tem permissão
              para acessá-la.
            </p>
          </Card>
        </div>
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
      if (
        window.confirm(
          "Tem certeza que deseja ativar o modo anônimo? Todos os novos cards serão criados como anônimos."
        )
      ) {
        setAnonymousMode(true);
      }
    } else {
      // Desativando modo anônimo
      if (
        window.confirm(
          "Tem certeza que deseja desativar o modo anônimo? Todos os novos cards mostrarão o autor."
        )
      ) {
        setAnonymousMode(false);
      }
    }
  };

  const gridColsClass = clsx({
    "grid-cols-1": (board.columns?.length || 0) === 1,
    "grid-cols-2": (board.columns?.length || 0) === 2,
    "grid-cols-3": (board.columns?.length || 0) === 3,
    "grid-cols-4": (board.columns?.length || 0) === 4,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Usuários ativos flutuando */}
      <ActiveUsers
        activeUsers={board.activeUsers || []}
        currentUserId="user1"
      />

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
                  if ((board.columns?.length || 0) >= MAX_COLUMNS) {
                    alert(
                      `Você pode adicionar no máximo ${MAX_COLUMNS} colunas por board.`
                    );
                    return;
                  }
                  handleCreateColumn();
                }}
                disabled={(board.columns?.length || 0) >= MAX_COLUMNS}
                title={
                  (board.columns?.length || 0) >= MAX_COLUMNS
                    ? `Máximo de ${MAX_COLUMNS} colunas permitidas`
                    : "Adicionar coluna"
                }
                className={`rounded-full w-10 h-10 p-0 ${
                  (board.columns?.length || 0) >= MAX_COLUMNS
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
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
              items={board.columns?.map((col) => col.id) || []}
              strategy={horizontalListSortingStrategy}
            >
              <div className={`gap-6 pb-6 grid ${gridColsClass}`}>
                {(board.columns || [])
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((column) => (
                    <RetroColumnComponent
                      key={column.id}
                      column={column}
                      onCreateCard={handleCreateCard}
                      onDeleteCard={handleDeleteCard}
                      onVoteCard={handleVoteCard}
                      onDeleteColumn={handleDeleteColumn}
                      onUpdateColumn={(columnId, updates) =>
                        handleUpdateColumn(columnId, updates)
                      }
                      boardSettings={{
                        allowVoting: board.allow_voting,
                        maxVotesPerUser: board.max_votes_per_user,
                        showAuthor: board.show_author,
                        allowAnonymous: anonymousMode || board.allow_anonymous,
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
