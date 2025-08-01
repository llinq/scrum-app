export interface RetroCard {
  id: string;
  content: string;
  author: string;
  columnId: string;
  createdAt: Date;
  votes: number;
  votedBy: string[];
}

export interface RetroColumn {
  id: string;
  title: string;
  order: number;
  cards: RetroCard[];
}

export interface ActiveUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface RetroBoard {
  id: string;
  title: string;
  columns: RetroColumn[];
  createdBy: string;
  createdAt: Date;
  activeUsers?: ActiveUser[];
  settings: {
    allowVoting: boolean;
    maxVotesPerUser: number;
    showAuthor: boolean;
    allowAnonymous: boolean;
  };
}

export interface CreateRetroCardData {
  content: string;
  columnId: string;
  anonymous?: boolean;
}

export interface CreateColumnData {
  title: string;
}

export interface UpdateColumnData {
  id: string;
  title?: string;
  color?: string;
  order?: number;
}

export interface ReorderColumnsData {
  columnIds: string[];
}

export interface VoteCardData {
  cardId: string;
  action: 'add' | 'remove';
}

export const COLUMN_COLORS = [
  { name: 'Azul', value: 'bg-blue-100 border-blue-300' },
  { name: 'Verde', value: 'bg-green-100 border-green-300' },
  { name: 'Amarelo', value: 'bg-yellow-100 border-yellow-300' },
  { name: 'Vermelho', value: 'bg-red-100 border-red-300' },
  { name: 'Roxo', value: 'bg-purple-100 border-purple-300' },
  { name: 'Rosa', value: 'bg-pink-100 border-pink-300' },
  { name: 'Cinza', value: 'bg-gray-100 border-gray-300' },
  { name: 'Laranja', value: 'bg-orange-100 border-orange-300' },
] as const;

export const DEFAULT_RETRO_COLUMNS: Omit<RetroColumn, 'id' | 'cards'>[] = [
  {
    title: 'O que foi bem?',
    order: 0,
  },
  {
    title: 'O que pode melhorar?',
    order: 1,
  },
  {
    title: 'Ações para próxima sprint',
    order: 2,
  },
];
