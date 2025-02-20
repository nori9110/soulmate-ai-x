import React from 'react';
import { Box, Typography, Chip, Stack, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../../types/database.types';

interface ChatHeaderProps {
  theme: Theme | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ theme }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton onClick={() => navigate('/theme-selection')} size="small" sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontFamily: "'Zen Old Mincho', serif" }}
        >
          テーマ
        </Typography>
        <Chip label={theme?.name || '不明なテーマ'} color="primary" variant="outlined" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          {theme?.description || ''}
        </Typography>
      </Stack>
    </Box>
  );
};
