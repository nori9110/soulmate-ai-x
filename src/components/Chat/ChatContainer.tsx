import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Box, Paper, CircularProgress, Alert, Typography, Chip, Stack } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Message, Profile } from '../../types/database.types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateChatResponse } from '../../utils/chat';
import { themes } from '../Theme/ThemeSelectionScreen';

interface LocationState {
  theme: string;
  themeName: string;
  themeDescription: string;
}

interface ChatContainerProps {
  themeId: string;
}

// エラーメッセージを統一的に処理するヘルパー関数
const formatError = (prefix: string, error: unknown): string => {
  if (error instanceof Error) {
    return `${prefix}: ${error.message}`;
  }
  if (typeof error === 'object' && error !== null) {
    const supabaseError = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    const details = [
      supabaseError.message,
      supabaseError.details,
      supabaseError.hint,
      supabaseError.code,
    ]
      .filter(Boolean)
      .join(' - ');
    return `${prefix}: ${details || 'Unknown error'}`;
  }
  return `${prefix}: ${String(error)}`;
};

export const ChatContainer: React.FC<ChatContainerProps> = ({ themeId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!themeId) {
      navigate('/theme-selection');
    }
  }, [themeId, navigate]);

  const { user, session, sessionStartTime } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const theme = useMemo(() => {
    if (!state?.theme) return null;
    return {
      id: state.theme,
      name: state.themeName,
      description: state.themeDescription,
      created_at: new Date().toISOString(),
    };
  }, [state]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = useCallback(async () => {
    if (!session?.access_token || !sessionStartTime || !user?.id || !themeId) {
      setError('セッションが無効です。再度ログインしてください。');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('theme_id', themeId)
        .eq('user_id', user.id)
        .gte('created_at', sessionStartTime)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      setError(null);
    } catch (error) {
      setMessages([]);
      setError(formatError('メッセージ読み込みエラー', error));
    }
  }, [themeId, user?.id, session?.access_token, sessionStartTime]);

  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    if (user && session && sessionStartTime) {
      loadMessages();
    } else {
      setError('ログインが必要です。');
    }
  }, [user, session, sessionStartTime, loadMessages]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user || !theme || !themeId) {
      setError('セッションが無効です。再度ログインしてください。');
      return;
    }

    const themeExists = themes.find((theme) => theme.id === themeId);

    if (!themeExists) {
      setError('選択されたテーマが見つかりません。テーマを再選択してください。');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userMessage: Partial<Message> = {
        user_id: user.id,
        content,
        role: 'user',
        theme_id: themeId,
      };

      const { error: insertError } = await supabase.from('messages').insert([userMessage]);
      if (insertError) throw insertError;

      const { error: updateError } = await supabase.rpc('increment_prompt_count', {
        user_id: user.id,
      });

      if (updateError) {
        setError(formatError('プロンプトカウントの更新に失敗', updateError));
        return;
      }

      const chatHistory = messages.map(({ role, content }) => ({ role, content }));
      const aiResponse = await generateChatResponse(
        [...chatHistory, { role: 'user', content }],
        theme
      );

      const assistantMessage: Partial<Message> = {
        user_id: user.id,
        content: aiResponse,
        role: 'assistant',
        theme_id: themeId,
      };

      const { error: assistantError } = await supabase.from('messages').insert([assistantMessage]);
      if (assistantError) throw assistantError;

      await loadMessages();
    } catch (error) {
      setError(formatError('メッセージ送信エラー', error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" color="text.secondary">
            テーマ：
          </Typography>
          <Chip label={theme?.name || '不明なテーマ'} color="primary" variant="outlined" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {theme?.description || ''}
          </Typography>
        </Stack>
      </Box>
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            username={profile?.username || 'ゲスト'}
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};
