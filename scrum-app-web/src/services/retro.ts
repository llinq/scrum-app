import { apiService } from './api';
import {
  RetroBoard,
  RetroColumn,
  RetroCard,
  CreateRetroCardData,
  CreateColumnData,
  UpdateColumnData,
  UpdateCardData,
  UpdateBoardData,
  ReorderColumnsData,
  MessageResponse,
  VoteResponse,
} from '../types/retro';

class RetroService {
  // Boards
  async getBoards(): Promise<RetroBoard[]> {
    return await apiService.get<RetroBoard[]>('/retro-boards');
  }

  async getMyBoards(): Promise<RetroBoard[]> {
    return await apiService.get<RetroBoard[]>('/retro-boards/my-boards');
  }

  async getBoard(id: string): Promise<RetroBoard> {
    return await apiService.get<RetroBoard>(`/retro-boards/${id}`);
  }

  async createBoard(data: Partial<RetroBoard>): Promise<RetroBoard> {
    return await apiService.post<RetroBoard>('/retro-boards', data);
  }

  async updateBoard(id: string, data: UpdateBoardData): Promise<RetroBoard> {
    return await apiService.put<RetroBoard>(`/retro-boards/${id}`, data);
  }

  async deleteBoard(id: string): Promise<void> {
    await apiService.delete(`/retro-boards/${id}`);
  }

  async archiveBoard(id: string): Promise<RetroBoard> {
    return await apiService.put<RetroBoard>(`/retro-boards/${id}/archive`);
  }

  // Columns
  async getColumnsByBoard(boardId: string): Promise<RetroColumn[]> {
    return await apiService.get<RetroColumn[]>(`/retro-columns/board/${boardId}`);
  }

  async getColumn(columnId: string): Promise<RetroColumn> {
    return await apiService.get<RetroColumn>(`/retro-columns/${columnId}`);
  }

  async createColumn(boardId: string, data: CreateColumnData): Promise<RetroColumn> {
    return await apiService.post<RetroColumn>(`/retro-columns/board/${boardId}`, data);
  }

  async updateColumn(columnId: string, data: UpdateColumnData): Promise<RetroColumn> {
    return await apiService.patch<RetroColumn>(`/retro-columns/${columnId}`, data);
  }

  async deleteColumn(columnId: string): Promise<void> {
    await apiService.delete(`/retro-columns/${columnId}`);
  }

  async reorderColumns(boardId: string, data: ReorderColumnsData): Promise<RetroColumn[]> {
    return await apiService.put<RetroColumn[]>(`/retro-columns/board/${boardId}/reorder`, data);
  }

  // Cards
  async getCardsByColumn(columnId: string): Promise<RetroCard[]> {
    return await apiService.get<RetroCard[]>(`/retro-cards/column/${columnId}`);
  }

  async getCardsByBoard(boardId: string): Promise<RetroCard[]> {
    return await apiService.get<RetroCard[]>(`/retro-cards/board/${boardId}`);
  }

  async getCard(cardId: string): Promise<RetroCard> {
    return await apiService.get<RetroCard>(`/retro-cards/${cardId}`);
  }

  async createCard(columnId: string, data: CreateRetroCardData): Promise<RetroCard> {
    return await apiService.post<RetroCard>(`/retro-cards/column/${columnId}`, data);
  }

  async updateCard(cardId: string, data: UpdateCardData): Promise<RetroCard> {
    return await apiService.put<RetroCard>(`/retro-cards/${cardId}`, data);
  }

  async deleteCard(cardId: string): Promise<void> {
    await apiService.delete(`/retro-cards/${cardId}`);
  }

  // Voting
  async addVote(cardId: string): Promise<VoteResponse> {
    return await apiService.post(`/retro-cards/${cardId}/vote`);
  }

  async removeVote(cardId: string): Promise<MessageResponse> {
    return await apiService.delete(`/retro-cards/${cardId}/vote`);
  }
}

export const retroService = new RetroService();
