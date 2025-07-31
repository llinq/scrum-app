import { apiService } from './api';
import {
  RetroBoard,
  RetroColumn,
  RetroCard,
  CreateRetroCardData,
  CreateColumnData,
  UpdateColumnData,
  ReorderColumnsData,
  VoteCardData,
} from '../types/retro';

class RetroService {
  // Boards
  async getBoards(): Promise<RetroBoard[]> {
    return await apiService.get<RetroBoard[]>('/retro/boards');
  }

  async getBoard(id: string): Promise<RetroBoard> {
    return await apiService.get<RetroBoard>(`/retro/boards/${id}`);
  }

  async createBoard(data: Partial<RetroBoard>): Promise<RetroBoard> {
    return await apiService.post<RetroBoard>('/retro/boards', data);
  }

  async updateBoard(id: string, data: Partial<RetroBoard>): Promise<RetroBoard> {
    return await apiService.put<RetroBoard>(`/retro/boards/${id}`, data);
  }

  async deleteBoard(id: string): Promise<void> {
    await apiService.delete(`/retro/boards/${id}`);
  }

  // Columns
  async createColumn(boardId: string, data: CreateColumnData): Promise<RetroColumn> {
    return await apiService.post<RetroColumn>(`/retro/boards/${boardId}/columns`, data);
  }

  async updateColumn(columnId: string, data: UpdateColumnData): Promise<RetroColumn> {
    return await apiService.put<RetroColumn>(`/retro/columns/${columnId}`, data);
  }

  async deleteColumn(columnId: string): Promise<void> {
    await apiService.delete(`/retro/columns/${columnId}`);
  }

  async reorderColumns(boardId: string, data: ReorderColumnsData): Promise<RetroColumn[]> {
    return await apiService.put<RetroColumn[]>(`/retro/boards/${boardId}/columns/reorder`, data);
  }

  // Cards
  async createCard(data: CreateRetroCardData): Promise<RetroCard> {
    return await apiService.post<RetroCard>('/retro/cards', data);
  }

  async updateCard(cardId: string, data: Partial<RetroCard>): Promise<RetroCard> {
    return await apiService.put<RetroCard>(`/retro/cards/${cardId}`, data);
  }

  async deleteCard(cardId: string): Promise<void> {
    await apiService.delete(`/retro/cards/${cardId}`);
  }

  async moveCard(cardId: string, targetColumnId: string): Promise<RetroCard> {
    return await apiService.put<RetroCard>(`/retro/cards/${cardId}/move`, {
      columnId: targetColumnId,
    });
  }

  // Voting
  async voteCard(data: VoteCardData): Promise<RetroCard> {
    return await apiService.post<RetroCard>('/retro/cards/vote', data);
  }
}

export const retroService = new RetroService();
