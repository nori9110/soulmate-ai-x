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
          backgroundColor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'white' : 'text.primary',
          borderRadius: 2,
        }}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 'bold',
              color: isUser ? 'inherit' : 'primary.main',
            }}
          >
            {isUser ? username : 'KAGUYA'}
          </Typography>
          <Typography variant="body1">{message.content}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
