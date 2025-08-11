export interface RetroCard {
  id: string;
  column_id: string;
  content: string;
  author_id: string | null;
  author_name: string | null;
  is_anonymous: boolean;
  votes_count: number;
  created_at: Date;
  updated_at: Date;
  can_edit: boolean;
}

export interface RetroColumn {
  id: string;
  board_id: string;
  title: string;
  order_index: number;
  created_at: Date;
  updated_at: Date;
  cards?: RetroCard[];
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
  created_by: string;
  created_at: Date;
  updated_at: Date;
  allow_voting: boolean;
  max_votes_per_user: number;
  show_author: boolean;
  allow_anonymous: boolean;
  is_active: boolean;
  archived_at: Date | null;
  columns?: RetroColumn[];
  activeUsers?: ActiveUser[];
  can_edit: boolean;
}

export interface CreateRetroCardData {
  content: string;
  author_name?: string;
  isAnonymous?: boolean;
}

export interface CreateColumnData {
  title: string;
  orderIndex?: number;
}

export interface UpdateColumnData {
  title?: string;
  orderIndex?: number;
}

export interface UpdateCardData {
  content?: string;
  author_name?: string;
  is_anonymous?: boolean;
}

export interface UpdateBoardData {
  title?: string;
  allow_voting?: boolean;
  max_votes_per_user?: number;
  show_author?: boolean;
  allow_anonymous?: boolean;
  is_active?: boolean;
}

export interface ReorderColumnsData {
  columnIds: string[];
}

// Response types
export interface MessageResponse {
  message: string;
}

export interface VoteResponse {
  message: string;
  vote?: {
    id: string;
    card_id: string;
    user_id: string;
    created_at: Date;
  };
}
