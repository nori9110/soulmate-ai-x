import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

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

export const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (error) {
      const errorMessage = errorDescription || '認証エラーが発生しました。';
      setError(errorMessage);
      const cleanPath = window.location.pathname;
      window.history.replaceState({}, document.title, cleanPath);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setError(null);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/kaguyahime.png")',
        backgroundPosition: 'bottom left',
        backgroundSize: 'auto 80vh',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000000',
        position: 'relative',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95))',
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: '100%', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              mb: 4,
            }}
          >
            SoulMate Chat
          </Typography>
          <Paper
            sx={{
              p: 3,
              background: '#ffffff',
              border: '1px solid rgba(107, 70, 193, 0.2)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="auth tabs"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    textShadow: 'none',
                    '&.Mui-selected': {
                      color: '#1976d2',
                    },
                    '&:hover': {
                      color: '#1976d2',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#1976d2',
                    height: 3,
                    boxShadow: '0 0 8px rgba(25, 118, 210, 0.5)',
                  },
                }}
              >
                <Tab
                  label="ログイン"
                  sx={{
                    '&:hover': {
                      color: '#1976d2',
                      textShadow: 'none',
                    },
                  }}
                />
                <Tab
                  label="新規登録"
                  sx={{
                    '&:hover': {
                      color: '#1976d2',
                      textShadow: 'none',
                    },
                  }}
                />
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
    </Box>
  );
};
