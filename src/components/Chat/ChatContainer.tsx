import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Box, Paper, CircularProgress, Alert, Typography, Chip, Stack } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Message } from '../../types/database.types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateChatResponse } from '../../utils/chat';

interface LocationState {
  theme: string;
  approach: string;
  themeName: string;
  approachName: string;
  themeDescription: string;
  approachDescription: string;
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

export const ChatContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.theme || !state?.approach || !state?.themeName || !state?.approachName) {
      navigate('/theme-selection');
    }
  }, [state, navigate]);

  const { user, session, sessionStartTime } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useMemo(() => {
    if (!state?.theme) return null;
    return {
      id: state.theme,
      name: state.themeName,
      description: state.themeDescription,
      created_at: new Date().toISOString(),
    };
  }, [state]);
  const approach = useMemo(() => {
    if (!state?.approach) return null;
    return {
      id: state.approach,
      name: state.approachName,
      description: state.approachDescription,
      created_at: new Date().toISOString(),
    };
  }, [state]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = useCallback(async () => {
    if (
      !session?.access_token ||
      !sessionStartTime ||
      !user?.id ||
      !state?.theme ||
      !state?.approach
    ) {
      setError('セッションが無効です。再度ログインしてください。');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('theme_id', state.theme)
        .eq('approach_id', state.approach)
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
  }, [state?.theme, state?.approach, user?.id, session?.access_token, sessionStartTime]);

  useEffect(() => {
    if (user && session && sessionStartTime) {
      loadMessages();
    } else {
      setError('ログインが必要です。');
    }
  }, [user, session, sessionStartTime, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user || !theme || !approach || !state?.theme || !state?.approach) {
      setError('セッションが無効です。再度ログインしてください。');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userMessage: Partial<Message> = {
        user_id: user.id,
        content,
        role: 'user',
        theme_id: state.theme,
        approach_id: state.approach,
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
        theme,
        approach
      );

      const assistantMessage: Partial<Message> = {
        user_id: user.id,
        content: aiResponse,
        role: 'assistant',
        theme_id: state.theme,
        approach_id: state.approach,
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
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle1" color="text.secondary">
              テーマ：
            </Typography>
            <Chip label={theme?.name || '不明なテーマ'} color="primary" variant="outlined" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {theme?.description || ''}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle1" color="text.secondary">
              アプローチ：
            </Typography>
            <Chip
              label={approach?.name || '不明なアプローチ'}
              color="secondary"
              variant="outlined"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {approach?.description || ''}
            </Typography>
          </Stack>
        </Stack>
      </Box>
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
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
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
