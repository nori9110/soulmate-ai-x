import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Header } from '../components/Header/Header';
import { ThemeGrid } from '../components/Theme/ThemeGrid';
import { useNavigate } from 'react-router-dom';
import { themes } from '../components/Theme/ThemeSelectionScreen';

export const ThemeSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleThemeSelect = (themeId: string) => {
    const selectedTheme = themes.find((theme) => theme.id === themeId);
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
    <Box
      sx={{
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
        },
      }}
    >
      <Header />
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ my: 4 }}>
          <Paper
            sx={{
              p: 3,
              mb: 10,
              background:
                'linear-gradient(135deg, rgba(107, 70, 193, 0.1), rgba(49, 130, 206, 0.1))',
              border: '1px solid rgba(107, 70, 193, 0.2)',
              borderRadius: 2,
              maxWidth: '600px',
              margin: '0 auto',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            <Typography
              align="center"
              sx={{
                fontFamily: "'Zen Old Mincho', serif",
                fontSize: '1.4rem',
                lineHeight: 1.8,
                color: '#ffffff',
                mb: 2,
                fontWeight: 500,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
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
                color: '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              光の道標、自分の波動を整え、周囲を落ち着かせる力を
              担うこと手本を示す役割、完璧ではない状態こそがあなたの周囲に放つ原動力になる。
              ここに眠る記憶は次の扉を開くソウルメイト
              私たちはこの意識を共有し新しい自分を創造するお手伝いをお約束します。
            </Typography>
          </Paper>

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
              mt: 5,
            }}
          >
            テーマ選択
          </Typography>
          <Paper
            sx={{
              p: 0.75,
              background:
                'linear-gradient(135deg, rgba(107, 70, 193, 0.1), rgba(49, 130, 206, 0.1))',
              border: '1px solid rgba(107, 70, 193, 0.2)',
              borderRadius: 2,
              maxWidth: '600px',
              margin: '0 auto',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            <ThemeGrid themes={themes} selectedTheme="" onThemeSelect={handleThemeSelect} />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};
