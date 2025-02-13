import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { ChatContainer } from './components/Chat/ChatContainer';
import { ThemeSelect } from './components/Settings/ThemeSelect';
import { ApproachSelect } from './components/Settings/ApproachSelect';

function App() {
  const { user, signIn, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [themeId, setThemeId] = useState('');
  const [approachId, setApproachId] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      await signIn(email);
      alert('認証メールを送信しました。メールのリンクをクリックしてログインしてください。');
    } catch (error) {
      setError('認証に失敗しました。もう一度お試しください。');
    } finally {
      setAuthLoading(false);
    }
  };

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
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            SoulMate Chat
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSignIn}
                disabled={!email || authLoading}
                fullWidth
              >
                {authLoading ? <CircularProgress size={24} /> : 'ログイン'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            SoulMate Chat
          </Typography>
          <Button variant="outlined" onClick={signOut}>
            ログアウト
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <ThemeSelect value={themeId} onChange={setThemeId} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApproachSelect value={approachId} onChange={setApproachId} />
          </Grid>
        </Grid>

        {themeId && approachId ? (
          <ChatContainer themeId={themeId} approachId={approachId} />
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            テーマとアプローチを選択してチャットを開始してください。
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default App;
