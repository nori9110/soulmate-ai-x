import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Collapse,
  IconButton,
} from '@mui/material';
import { supabase } from '../../lib/supabase';
import { Message } from '../../types/database.types';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ChatHistoryDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ChatSession {
  date: string;
  theme: string;
  messages: Message[];
  timestamp: string;
  sessionId: string;
}

export const ChatHistoryDialog: React.FC<ChatHistoryDialogProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [expandedSessions, setExpandedSessions] = useState<{ [key: string]: boolean }>({});
  const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();

  const loadChatHistory = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*, themes:theme_id(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const groupedMessages = messages.reduce((acc: { [key: string]: ChatSession }, message) => {
        const date = format(new Date(message.created_at), 'yyyy-MM-dd');
        const timestamp = message.created_at;
        
        const shouldStartNewSession = (lastMessage?: Message) => {
          if (!lastMessage) return true;
          if (message.theme_id !== lastMessage.theme_id) return true;
          const timeDiff = new Date(message.created_at).getTime() - new Date(lastMessage.created_at).getTime();
          return timeDiff > 30 * 60 * 1000;
        };

        const lastSession = Object.values(acc).pop();
        const lastMessage = lastSession?.messages[lastSession.messages.length - 1];
        
        let sessionKey = '';
        if (shouldStartNewSession(lastMessage)) {
          sessionKey = `${date}_${message.theme_id}_${timestamp}`;
        } else {
          sessionKey = Object.keys(acc).pop() || '';
        }

        if (!acc[sessionKey]) {
          acc[sessionKey] = {
            date,
            timestamp,
            theme: message.themes?.name || '不明なテーマ',
            messages: [],
            sessionId: sessionKey,
          };
        }
        acc[sessionKey].messages.push(message);
        return acc;
      }, {});

      const sortedHistory = Object.values(groupedMessages)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setChatHistory(sortedHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setLoading(false);
      setChatHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && user) {
      loadChatHistory();
    }
  }, [open, user, loadChatHistory]);

  const handleToggleExpand = (sessionKey: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionKey]: !prev[sessionKey],
    }));
  };

  const handleToggleMessages = (messageId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Zen Maru Gothic', serif",
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        チャット履歴
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : chatHistory.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            チャット履歴がありません
          </Typography>
        ) : (
          <List>
            {chatHistory.map((session, index) => {
              const sessionKey = `${session.date}_${session.theme}`;
              const isExpanded = expandedSessions[sessionKey];
              const userMessages = session.messages.filter(m => m.role === 'user');
              const messagesPairs = userMessages.map(userMsg => {
                const aiResponse = session.messages.find(m => 
                  m.role === 'assistant' && 
                  new Date(m.created_at).getTime() > new Date(userMsg.created_at).getTime()
                );
                return { user: userMsg, ai: aiResponse };
              });

              return (
                <React.Fragment key={sessionKey}>
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        {format(new Date(session.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        テーマ: {session.theme}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      {messagesPairs.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ mb: 0.5 }}
                          >
                            あなた: {messagesPairs[0].user.content}
                          </Typography>
                          {messagesPairs[0].ai && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ pl: 2 }}
                            >
                              AI: {messagesPairs[0].ai.content}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {messagesPairs.length > 1 && (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleToggleMessages(sessionKey)}
                            endIcon={expandedMessages[sessionKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            sx={{ mb: 1 }}
                          >
                            {expandedMessages[sessionKey] ? '折りたたむ' : `他 ${messagesPairs.length - 1} 件のメッセージを表示`}
                          </Button>
                          <Collapse in={expandedMessages[sessionKey]}>
                            {messagesPairs.slice(1).map((pair, idx) => (
                              <Box key={pair.user.id} sx={{ mb: 2 }}>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ mb: 0.5 }}
                                >
                                  あなた: {pair.user.content}
                                </Typography>
                                {pair.ai && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ pl: 2 }}
                                  >
                                    AI: {pair.ai.content}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Collapse>
                        </>
                      )}
                    </Box>
                  </ListItem>
                  {index < chatHistory.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};
