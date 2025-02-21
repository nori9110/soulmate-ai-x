import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { ThemeSelectionPage } from './pages/ThemeSelectionPage';
import { ChatPage } from './pages/ChatPage';
import { LoginPage } from './components/Auth/LoginPage';
import { UpdateNotification } from './components/UpdateNotification';

function App() {
  // 追加: 現在のホストが 'soulmate-ai-ten.vercel.app' でない場合、本番用URLに強制リダイレクト
  useEffect(() => {
    const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

    if (vercelEnv === 'production' && window.location.hostname !== 'soulmate-ai-ten.vercel.app') {
      // eslint-disable-next-line no-console
      console.warn(
        'Redirecting from',
        window.location.hostname,
        'to https://soulmate-ai-ten.vercel.app'
      );
      const newUrl = `https://soulmate-ai-ten.vercel.app${window.location.pathname}${window.location.search}`;
      window.location.replace(newUrl);
    }
  }, []);

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<ThemeSelectionPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <UpdateNotification />
    </>
  );
}

export default App;
