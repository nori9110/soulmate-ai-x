import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import { ChatContainer } from './components/Chat/ChatContainer';
import { ThemeSelect } from './components/Settings/ThemeSelect';
import { ApproachSelect } from './components/Settings/ApproachSelect';
import { Header } from './components/Header/Header';
import { supabase } from './lib/supabase';
import { UpdateNotification } from './components/UpdateNotification';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

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

  const { user, signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [themeId, setThemeId] = useState('');
  const [approachId, setApproachId] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    // エラーパラメータの処理
    if (error) {
      const errorMessage = errorDescription || '認証エラーが発生しました。';
      setError(errorMessage);

      // エラーの場合、URLからエラーパラメータを削除
      const cleanPath = window.location.pathname;
      window.history.replaceState({}, document.title, cleanPath);
      return;
    }

    // セッションの監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // 認証成功時の処理
        setError(null);
        // 認証成功後、即座にURLパラメータをクリア
        if (window.location.search) {
          const path = window.location.pathname;
          window.history.replaceState({}, document.title, path);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。');
      return;
    }
    try {
      setError(null);
      setAuthLoading(true);
      await signUp(email, password);
      alert('認証メールを送信しました。メールのリンクをクリックして登録を完了してください。');
    } catch (error) {
      setError('新規登録に失敗しました。もう一度お試しください。');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      await signIn(email, password);
    } catch (error) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="auth tabs">
                <Tab label="ログイン" />
                <Tab label="新規登録" />
              </Tabs>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="メールアドレス"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                      },
                    },
                  }}
                />
                <TextField
                  label="パスワード"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSignIn}
                  disabled={authLoading}
                  fullWidth
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  {authLoading ? <CircularProgress size={24} /> : 'ログイン'}
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="メールアドレス"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                      },
                    },
                  }}
                />
                <TextField
                  label="パスワード"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="6文字以上で入力してください"
                  fullWidth
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                      },
                    },
                  }}
                />
                <TextField
                  label="パスワード（確認）"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'background.paper',
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSignUp}
                  disabled={!email || !password || !confirmPassword || authLoading}
                  fullWidth
                >
                  {authLoading ? <CircularProgress size={24} /> : '新規登録'}
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
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
      <UpdateNotification />
    </>
  );
}

export default App;
