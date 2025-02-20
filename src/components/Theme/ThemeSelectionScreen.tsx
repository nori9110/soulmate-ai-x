import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Theme } from '../../types/database.types';

export const themes: Theme[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'フリー',
    description: '特定のテーマにとらわれず、自由に話し合いたい内容について対話します。',
    icon: <CreateIcon sx={{ fontSize: 20, color: '#4CAF50' }} />,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: '将来への不安',
    description: '将来の不安や悩みについて一緒に考え、解決策を見つけます。',
    icon: <HelpOutlineIcon sx={{ fontSize: 20, color: '#FF9800' }} />,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'お金に関して',
    description: '家計、投資、貯金など、お金に関する相談に応じます。',
    icon: <AttachMoneyIcon sx={{ fontSize: 20, color: '#2196F3' }} />,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: '仕事・就職',
    description: '仕事や就職に関する悩みについてアドバイスします。',
    icon: <WorkIcon sx={{ fontSize: 20, color: '#9C27B0' }} />,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: '人間関係',
    description: '友人、家族、職場など、人間関係の悩みを解決します。',
    icon: <PeopleIcon sx={{ fontSize: 20, color: '#E91E63' }} />,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    name: '学校成績・進学',
    description: '学業や進学に関する相談に応じます。',
    icon: <SchoolIcon sx={{ fontSize: 20, color: '#3F51B5' }} />,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    name: '容姿・健康',
    description: '健康管理や外見に関する相談に応じます。',
    icon: <HealthAndSafetyIcon sx={{ fontSize: 20, color: '#00BCD4' }} />,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    name: '政治・社会問題',
    description: '現代社会の課題について一緒に考えます。',
    icon: <AccountBalanceIcon sx={{ fontSize: 20, color: '#607D8B' }} />,
    created_at: new Date().toISOString(),
  },
];

export const ThemeSelectionScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleThemeSelect = (themeId: string) => {
    const selectedTheme = themes.find((t) => t.id === themeId);
    if (selectedTheme) {
      navigate('/chat', {
        state: {
          theme: themeId,
          themeName: selectedTheme.name,
          themeDescription: selectedTheme.description,
        },
        replace: true,
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontFamily: "'Zen Old Mincho', serif",
            fontSize: '2rem',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #6b46c1, #3182ce)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '0.05em',
            mb: 3,
          }}
        >
          テーマ選択
        </Typography>
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background:
              'linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(49, 130, 206, 0.05))',
            border: '1px solid rgba(107, 70, 193, 0.1)',
            borderRadius: 2,
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <Typography
            align="center"
            sx={{
              fontFamily: "'Zen Old Mincho', serif",
              fontSize: '1.2rem',
              lineHeight: 1.8,
              color: 'text.primary',
              mb: 2,
            }}
          >
            スターシード〜ライトワーカー癒しのお手伝い
          </Typography>
          <Typography
            align="center"
            sx={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'text.secondary',
            }}
          >
            光の道標、自分の波動を整え、周囲を落ち着かせる力を
            担うこと手本を示す役割、完璧ではない状態こそがあなたの周囲に放つ原動力になる。
            ここに眠る記憶は次の扉を開くソウルメイト
            私たちはこの意識を共有し新しい自分を創造するお手伝いをお約束します。
          </Typography>
        </Paper>

        <Box sx={{ mt: 8, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
            以下のテーマを選択してください
          </Typography>
          <Button
            variant="contained"
            size="medium"
            onClick={() => handleThemeSelect('00000000-0000-0000-0000-000000000001')}
            sx={{ minWidth: '120px' }}
          >
            フリー
          </Button>
        </Box>

        <Paper
          sx={{
            p: 1.5,
            mb: 12,
            background:
              'linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(49, 130, 206, 0.05))',
            border: '1px solid rgba(107, 70, 193, 0.1)',
            borderRadius: 2,
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 1, px: 1 }}>
            どのようなテーマについて話し合いたいですか？
          </Typography>
          <Grid container spacing={0.75} sx={{ px: 0.5 }}>
            {themes.map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                    width: '100%',
                    maxWidth: '250px',
                    mx: 'auto',
                    my: 0.125,
                  }}
                >
                  <CardActionArea
                    onClick={() => handleThemeSelect(item.id)}
                    sx={{
                      height: '100%',
                      width: '100%',
                      p: 0.75,
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: '100%',
                        py: 0.5,
                        px: 0.75,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          mr: 0.75,
                          display: 'flex',
                          alignItems: 'center',
                          minWidth: 'auto',
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          width: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: '0.8rem',
                            mb: 0.25,
                            fontWeight: 'normal',
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.65rem',
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};
