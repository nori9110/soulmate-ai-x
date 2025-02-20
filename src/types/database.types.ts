import { ReactNode } from 'react';

export interface Message {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  theme_id: string;
  created_at: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  created_at: string;
  icon?: ReactNode;
}

export interface Profile {
  id: string;
  username: string;
  age_group: '10代' | '20代' | '30代' | '40代' | '50代以上' | '未回答';
  gender: '男性' | '女性' | 'その他' | '未回答';
  occupation: string | null;
  interests: string[];
  bio: string | null;
  avatar_url: string | null;
  prompt_count: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Message>;
      };
      themes: {
        Row: Theme;
        Insert: Omit<Theme, 'id' | 'created_at' | 'icon'>;
        Update: Partial<Omit<Theme, 'icon'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Profile>;
      };
    };
  };
}
