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
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ my: 1 }}>
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
              p: 0.75,
              background:
                'linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(49, 130, 206, 0.05))',
              border: '1px solid rgba(107, 70, 193, 0.1)',
              borderRadius: 2,
              maxWidth: '380px',
              margin: '0 auto',
            }}
          >
            <ThemeGrid themes={themes} selectedTheme="" onThemeSelect={handleThemeSelect} />
          </Paper>
        </Box>
      </Container>
    </>
  );
};
