export interface Message {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  theme_id: string;
  approach_id: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Approach {
  id: string;
  name: string;
  description: string;
  created_at: string;
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
        Insert: Omit<Theme, 'id' | 'created_at'>;
        Update: Partial<Theme>;
      };
      approaches: {
        Row: Approach;
        Insert: Omit<Approach, 'id' | 'created_at'>;
        Update: Partial<Approach>;
      };
    };
  };
}
