import React from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { Message } from '../../types/database.types';

interface ChatMessageProps {
  message: Message;
  username: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, username }) => {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          maxWidth: '70%',
          backgroundColor: isUser ? 'primary.main' : 'rgba(230, 240, 255, 0.95)',
          color: isUser ? 'white' : '#1a1a1a',
          borderRadius: 2,
          boxShadow: isUser ? 1 : '0 2px 4px rgba(0,0,0,0.1)',
          border: isUser ? 'none' : '1px solid rgba(200, 220, 255, 0.5)',
        }}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 'bold',
              color: isUser ? 'inherit' : '#2c5282',
              fontSize: '0.7rem',
            }}
          >
            {isUser ? username : 'KAGUYA'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8rem',
            }}
          >
            {message.content}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
