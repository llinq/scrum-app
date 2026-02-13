"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Edit2, Trash2, User } from "lucide-react";
import type { RetroCard } from "../../types/retro";
import { useAuth } from "@/lib/auth-context";
import { retroService } from "../../services/retro";

interface RetroCardProps {
  card: RetroCard;
  onDelete: (cardId: string) => void;
  onVote: (cardId: string) => void;
  boardSettings: {
    allowVoting: boolean;
    maxVotesPerUser: number;
    showAuthor: boolean;
    allowAnonymous: boolean;
    blurMode: boolean;
  };
}

export default function RetroCardComponent({
  card,
  onDelete,
  onVote,
  boardSettings,
}: RetroCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();

  // Posicionar cursor no final do texto quando entrar no modo de edição
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      // Aguardar o próximo frame para garantir que o elemento esteja renderizado
      setTimeout(() => {
        textarea.focus();
        // Posicionar cursor no final do texto
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }, 0);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    // Não salvar se o conteúdo estiver vazio ou não tiver mudado
    if (!editContent.trim() || editContent.trim() === card.content) {
      setIsEditing(false);
      setEditContent(card.content);
      return;
    }

    try {
      setIsUpdating(true);

      // Chama a API para atualizar o card
      await retroService.updateCard(card.id, {
        content: editContent.trim(),
      });

      // Fechar o modo de edição após sucesso
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar card:", error);
      alert("Erro ao atualizar card. Tente novamente.");
      // Em caso de erro, mantém o modo de edição
    } finally {
      setIsUpdating(false);
    }
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
  };

  const handleVote = () => {
    onVote(card.id);
  };

  const hasVoted = false; // TODO
  const canEdit = card.author_id === user?.id;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              disabled={isUpdating}
              className="w-full text-sm text-gray-800 dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
              placeholder={
                isUpdating ? "Salvando..." : "Digite o conteúdo do card"
              }
            />
          ) : (
            <p
              className={`text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words overflow-hidden transition-all duration-300 ${
                boardSettings.blurMode ? "blur-sm select-none" : ""
              }`}
            >
              {card.content}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-1 mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3" />
            <span>{boardSettings.showAuthor ? card.author_name : ""}</span>
          </div>

          <div className="flex justify-end">
            {boardSettings.allowVoting && (
              <button
                onClick={handleVote}
                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 cursor-pointer transition-colors ${
                  hasVoted
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-red-500"
                }`}
                title="Votar neste card"
              >
                <Heart
                  className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`}
                />
                {card.votes_count > 0 && (
                  <span className="text-xs">{card.votes_count}</span>
                )}
              </button>
            )}

            {canEdit && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  title="Editar card"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors"
                  title="Excluir card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {isUpdating
            ? "Salvando alterações..."
            : "Pressione Ctrl+Enter para salvar ou Esc para cancelar"}
        </div>
      )}
    </div>
  );
}
