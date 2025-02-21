import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Button, Stack, Chip } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: `url('/images/kaguyahime.png')`,
        backgroundPosition: 'bottom left',
        backgroundSize: 'auto 80vh',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000000',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Header />
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px !important',
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
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            テーマ選択に戻る
          </Button>
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryDialogOpen(true)}
            sx={{
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            チャット履歴
          </Button>
        </Box>

        <Paper
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 182, 193, 0.2)',
            border: '1px solid rgba(255, 182, 193, 0.4)',
            borderRadius: 2,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 10px rgba(255, 182, 193, 0.1)',
          }}
        >
          <ChatContainer themeId={state.theme} />
        </Paper>
      </Container>

      <ChatHistoryDialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} />
    </Box>
  );
};
