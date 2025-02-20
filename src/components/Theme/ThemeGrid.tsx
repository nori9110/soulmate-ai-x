import React from 'react';
import { Grid, Card, CardActionArea, Typography, Box, useTheme } from '@mui/material';
import { Theme } from '../../types/database.types';

interface ThemeGridProps {
  themes: Theme[];
  selectedTheme: string;
  onThemeSelect: (themeId: string) => void;
}

export const ThemeGrid: React.FC<ThemeGridProps> = ({ themes, selectedTheme, onThemeSelect }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={0.125}>
      {themes.map((item) => (
        <Grid item xs={12} sm={6} md={6} key={item.id}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: selectedTheme === item.id ? 'primary.50' : 'background.paper',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2],
              },
              maxWidth: '250px',
              mx: 'auto',
              my: 0.125,
            }}
          >
            <CardActionArea
              onClick={() => onThemeSelect(item.id)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                p: 0.75,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: '4px',
                  backgroundColor: selectedTheme === item.id ? 'primary.main' : 'primary.50',
                  color: selectedTheme === item.id ? 'white' : 'primary.main',
                  mr: 0.75,
                  '& .MuiSvgIcon-root': {
                    fontSize: '1rem',
                  },
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  component="h3"
                  sx={{
                    fontWeight: selectedTheme === item.id ? 'bold' : 'medium',
                    color: selectedTheme === item.id ? 'primary.main' : 'text.primary',
                    fontSize: '0.85rem',
                    mb: 0.25,
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    lineHeight: 1.2,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
