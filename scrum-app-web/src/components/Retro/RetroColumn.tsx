"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MoreVertical, Edit2, Trash2, GripVertical } from "lucide-react";
import { RetroColumn } from "../../types/retro";
import RetroCardComponent from "./RetroCard";
import Button from "../Button";
import { useAuth } from "@/lib/auth-context";

interface RetroColumnProps {
  column: RetroColumn;
  onCreateCard: (columnId: string, content: string) => void;
  onDeleteCard: (cardId: string) => void;
  onVoteCard: (cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, updates: Partial<RetroColumn>) => void;
  boardSettings: {
    allowVoting: boolean;
    maxVotesPerUser: number;
    showAuthor: boolean;
    allowAnonymous: boolean;
    blurMode: boolean;
  };
  boardPermissions: {
    canEdit: boolean;
  };
}

export default function RetroColumnComponent({
  column,
  onCreateCard,
  onDeleteCard,
  onVoteCard,
  onDeleteColumn,
  onUpdateColumn,
  boardSettings,
  boardPermissions,
}: RetroColumnProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [newCardContent, setNewCardContent] = useState("");

  const { user } = useAuth();

  const {
    attributes: sortableAttributes,
    listeners: sortableListeners,
    setNodeRef: setSortableNodeRef,
    transform: sortableTransform,
    transition: sortableTransition,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(sortableTransform),
    transition: sortableTransition,
  };

  const handleEditTitle = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      onUpdateColumn(column.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDeleteColumn = () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta coluna? Todos os cards serão perdidos."
      )
    ) {
      onDeleteColumn(column.id);
    }
    setShowDropdown(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardContent.trim()) {
      onCreateCard(column.id, newCardContent.trim());
      setNewCardContent("");
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleCreateCard(e);
    }
  };

  return (
    <div
      ref={setSortableNodeRef}
      style={sortableStyle}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-700 min-w-[280px] sm:min-w-[320px] w-full flex flex-col"
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {boardPermissions.canEdit && (
              <div
                {...sortableAttributes}
                {...sortableListeners}
                className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0"
              >
                <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            )}

            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 text-lg font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-400 rounded px-1 text-gray-800 dark:text-gray-200 cursor-text"
                autoFocus
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex-1 min-w-0 cursor-default truncate">
                {column.title}
              </h3>
            )}
          </div>

          {boardPermissions.canEdit && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[10rem]">
                  <button
                    onClick={handleEditTitle}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar nome
                  </button>
                  <button
                    onClick={handleDeleteColumn}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir coluna
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 flex flex-col">
        {/* Add Card Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleCreateCard} className="space-y-3">
            <textarea
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              onKeyDown={handleCardKeyDown}
              placeholder="Digite seu card aqui... (Ctrl+Enter para adicionar)"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={!newCardContent.trim()}
                className="ml-auto"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </form>
        </div>

        {/* Cards List */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {(column.cards || []).toReversed().map((card) => (
            <RetroCardComponent
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onVote={onVoteCard}
              boardSettings={boardSettings}
            />
          ))}

          {(column.cards?.length || 0) === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">
              <p className="text-sm">Nenhum card ainda</p>
              <p className="text-xs">Digite no campo acima para começar</p>
            </div>
          )}

          {/* Espaço mínimo para dropdown não ser cortado */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
