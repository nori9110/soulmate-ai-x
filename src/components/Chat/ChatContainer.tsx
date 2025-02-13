import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Paper, CircularProgress, Alert } from '@mui/material';
import { Message, Theme, Approach } from '../../types/database.types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateChatResponse } from '../../utils/chat';

interface ChatContainerProps {
  themeId: string;
  approachId: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ themeId, approachId }) => {
  const { user, session, sessionStartTime } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [approach, setApproach] = useState<Approach | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadThemeAndApproach = useCallback(async () => {
    try {
      const [{ data: themeData }, { data: approachData }] = await Promise.all([
        supabase.from('themes').select('*').eq('id', themeId).single(),
        supabase.from('approaches').select('*').eq('id', approachId).single(),
      ]);

      if (themeData) setTheme(themeData);
      if (approachData) setApproach(approachData);
    } catch (error) {
      setError('テーマとアプローチの読み込みに失敗しました。');
    }
  }, [themeId, approachId]);

  const loadMessages = useCallback(async () => {
    if (!session?.access_token || !sessionStartTime) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('theme_id', themeId)
        .eq('approach_id', approachId)
        .eq('user_id', user?.id)
        .gte('created_at', sessionStartTime)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      setError('メッセージの読み込みに失敗しました。');
      setMessages([]);
    }
  }, [themeId, approachId, user?.id, session?.access_token, sessionStartTime]);

  useEffect(() => {
    if (user && session && sessionStartTime) {
      loadThemeAndApproach();
      loadMessages();
    }
  }, [user, session, sessionStartTime, loadMessages, loadThemeAndApproach]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user || !theme || !approach) return;

    setLoading(true);
    setError(null);
    try {
      const userMessage: Partial<Message> = {
        user_id: user.id,
        content,
        role: 'user',
        theme_id: themeId,
        approach_id: approachId,
      };

      const { error: insertError } = await supabase.from('messages').insert([userMessage]);
      if (insertError) throw insertError;

      const { error: updateError } = await supabase.rpc('increment_prompt_count', {
        user_id: user.id
      });
      
      if (updateError) {
        console.error('プロンプトカウントの更新に失敗しました:', updateError);
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
        theme_id: themeId,
        approach_id: approachId,
      };

      const { error: assistantError } = await supabase.from('messages').insert([assistantMessage]);
      if (assistantError) throw assistantError;

      await loadMessages();
    } catch (error) {
      setError('メッセージの送信に失敗しました。');
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
