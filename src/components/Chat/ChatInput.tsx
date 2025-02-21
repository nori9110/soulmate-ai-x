import React, { useState, KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
      <TextField
        fullWidth
        multiline
        maxRows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        placeholder="メッセージを入力してください..."
        sx={{
          backgroundColor: 'background.paper',
          '& .MuiInputBase-root': {
            fontSize: '0.75rem',
            padding: '4px 8px',
          },
          '& .MuiOutlinedInput-root': {
            minHeight: '36px',
          },
        }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        sx={{
          alignSelf: 'flex-end',
          padding: '4px',
        }}
      >
        <SendIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>
    </Box>
  );
};
