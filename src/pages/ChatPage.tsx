import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ChatContainer } from '../components/Chat/ChatContainer';
import { Header } from '../components/Header/Header';
import { ChatHistoryDialog } from '../components/Chat/ChatHistoryDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';

interface LocationState {
  theme: string;
  themeName: string;
  themeDescription: string;
}

export const ChatPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // テーマが選択されていない場合は、テーマ選択画面にリダイレクト
  if (!state?.theme) {
    return <Navigate to="/" replace />;
  }

  const handleBackToThemes = () => {
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToThemes}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(107, 70, 193, 0.04)',
              },
            }}
          >
            テーマ選択に戻る
          </Button>
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryDialogOpen(true)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(107, 70, 193, 0.04)',
              },
            }}
          >
            チャット履歴
          </Button>
        </Box>

        <Paper
          sx={{
            p: 2,
            mb: 2,
            background:
              'linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(49, 130, 206, 0.05))',
            border: '1px solid rgba(107, 70, 193, 0.1)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontFamily: "'Zen Maru Gothic', serif",
              fontWeight: 500,
              color: 'primary.main',
              mb: 1,
            }}
          >
            {state.themeName}
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              fontFamily: "'Zen Maru Gothic', serif",
              lineHeight: 1.8,
              color: 'text.secondary',
              fontSize: '0.9rem',
            }}
          >
            {state.themeDescription}
          </Typography>
        </Paper>

        <Paper
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background:
              'linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(49, 130, 206, 0.05))',
            border: '1px solid rgba(107, 70, 193, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <ChatContainer themeId={state.theme} />
        </Paper>
      </Container>

      <ChatHistoryDialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} />
    </Box>
  );
};
