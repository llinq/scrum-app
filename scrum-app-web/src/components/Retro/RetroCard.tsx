"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, MoreVertical, Edit2, Trash2, User } from "lucide-react";
import type { RetroCard } from "../../types/retro";

interface RetroCardProps {
  card: RetroCard;
  onDelete: (cardId: string) => void;
  onVote: (cardId: string) => void;
  boardSettings: {
    allowVoting: boolean;
    maxVotesPerUser: number;
    showAuthor: boolean;
    allowAnonymous: boolean;
  };
}

export default function RetroCardComponent({
  card,
  onDelete,
  onVote,
  boardSettings,
}: RetroCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
    "bottom"
  );
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Calcular posição do dropdown baseado no espaço disponível
  const calculateDropdownPosition = () => {
    if (!dropdownButtonRef.current) return;

    const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const dropdownHeight = 80; // Altura estimada do dropdown (2 items × 40px cada)

    // Se não há espaço suficiente embaixo, abrir para cima
    if (buttonRect.bottom + dropdownHeight > windowHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  };

  useEffect(() => {
    if (showDropdown) {
      calculateDropdownPosition();
    }
  }, [showDropdown]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleSaveEdit = () => {
    // In a real app, you would call an API to update the card
    // For now, we'll just close the edit mode
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(card.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este card?")) {
      onDelete(card.id);
    }
    setShowDropdown(false);
  };

  const handleVote = () => {
    onVote(card.id);
  };

  const currentUserId = "current-user"; // Replace with actual user ID
  const hasVoted = false; // TODO

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full text-sm text-gray-800 dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text"
              autoFocus
              rows={3}
            />
          ) : (
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words overflow-hidden cursor-default">
              {card.content}
            </p>
          )}

          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3" />
            <span>{boardSettings.showAuthor ? card.author_name : "~"}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 mt-2">
          {boardSettings.allowVoting && (
            <button
              onClick={handleVote}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 cursor-pointer ${
                hasVoted
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
              {card.votes_count > 0 && (
                <span className="text-xs">{card.votes_count}</span>
              )}
            </button>
          )}

          <div className="relative">
            <button
              ref={dropdownButtonRef}
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {showDropdown && (
              <div
                className={`absolute right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-32 ${
                  dropdownPosition === "top" ? "bottom-6" : "top-6"
                }`}
              >
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Pressione Ctrl+Enter para salvar ou Esc para cancelar
        </div>
      )}

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
