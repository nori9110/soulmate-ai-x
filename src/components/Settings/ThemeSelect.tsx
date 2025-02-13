import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Theme } from '../../types/database.types';
import { supabase } from '../../lib/supabase';

interface ThemeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ThemeSelect: React.FC<ThemeSelectProps> = ({ value, onChange }) => {
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
    loadThemes();
  }, []);

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

  return (
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
  );
};
