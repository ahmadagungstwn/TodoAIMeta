export type IdeaStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';
export type SourceType = 'manual' | 'voice' | 'scan';
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  source_type: SourceType;
  created_at: string;
  updated_at: string;
}

export interface IdeaTask {
  id: string;
  user_id: string;
  idea_id: string;
  title: string;
  is_done: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AiChat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AiMessage {
  id: string;
  chat_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}
