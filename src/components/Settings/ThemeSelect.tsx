import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { Theme } from '../../types/database.types';
import { supabase } from '../../lib/supabase';

interface ThemeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ThemeSelect: React.FC<ThemeSelectProps> = ({ value, onChange }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    if (value) {
      const theme = themes.find((t) => t.id === value);
      setSelectedTheme(theme || null);
    } else {
      setSelectedTheme(null);
    }
  }, [value, themes]);

  const loadThemes = async () => {
    try {
      const { data, error } = await supabase.from('themes').select('*');
      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      setThemes([]);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <Typography
        key={index}
        variant={line.startsWith('-') ? 'body2' : line.startsWith('例：') ? 'subtitle2' : 'body1'}
        sx={{
          ml: line.startsWith('-') ? 2 : 0,
          mt: line.startsWith('例：') ? 1 : 0,
          color: line.startsWith('-') ? 'text.secondary' : 'text.primary',
        }}
      >
        {line}
      </Typography>
    ));
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="theme-select-label">テーマ</InputLabel>
        <Select
          labelId="theme-select-label"
          id="theme-select"
          value={value}
          label="テーマ"
          onChange={handleChange}
        >
          {themes.map((theme) => (
            <MenuItem key={theme.id} value={theme.id}>
              {theme.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedTheme && (
        <Paper sx={{ mt: 2, p: 2 }} variant="outlined">
          {formatDescription(selectedTheme.description)}
        </Paper>
      )}
    </Box>
  );
};
