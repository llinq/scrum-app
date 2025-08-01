"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Card from './Card';

interface CreateRetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  loading?: boolean;
}

export default function CreateRetroModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}: CreateRetroModalProps) {
  const [retroName, setRetroName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!retroName.trim()) {
      setError('O nome da retrospectiva é obrigatório');
      return;
    }

    if (retroName.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return;
    }

    setError('');
    onSubmit(retroName.trim());
    // Reset form after successful submission
    setRetroName('');
  };

  const handleClose = () => {
    if (!loading) { // Only allow closing if not loading
      setRetroName('');
      setError('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
      onClick={(e) => {
        // Close only if clicking on backdrop and not loading
        if (e.target === e.currentTarget && !loading) {
          handleClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <Card>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Nova Retrospectiva
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome da Retrospectiva"
                type="text"
                value={retroName}
                onChange={(e) => setRetroName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Sprint 3 - Retrospectiva"
                error={error}
                disabled={loading}
                autoFocus
              />

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!retroName.trim() || loading}
                >
                  Criar Retrospectiva
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
