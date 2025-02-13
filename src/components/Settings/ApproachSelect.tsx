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
import { Approach } from '../../types/database.types';
import { supabase } from '../../lib/supabase';

interface ApproachSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApproachSelect: React.FC<ApproachSelectProps> = ({ value, onChange }) => {
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [selectedApproach, setSelectedApproach] = useState<Approach | null>(null);

  useEffect(() => {
    loadApproaches();
  }, []);

  useEffect(() => {
    if (value) {
      const approach = approaches.find((a) => a.id === value);
      setSelectedApproach(approach || null);
    } else {
      setSelectedApproach(null);
    }
  }, [value, approaches]);

  const loadApproaches = async () => {
    try {
      const { data, error } = await supabase.from('approaches').select('*');
      if (error) throw error;
      setApproaches(data || []);
    } catch (error) {
      setApproaches([]);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <Typography
        key={index}
        variant={
          line.startsWith('-')
            ? 'body2'
            : line.startsWith('特徴：') || line.startsWith('例：')
              ? 'subtitle2'
              : 'body1'
        }
        sx={{
          ml: line.startsWith('-') ? 2 : 0,
          mt: line.startsWith('特徴：') || line.startsWith('例：') ? 1 : 0,
          color: line.startsWith('-') ? 'text.secondary' : 'text.primary',
          fontStyle: line.startsWith('例：') ? 'italic' : 'normal',
        }}
      >
        {line}
      </Typography>
    ));
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="approach-select-label">アプローチ</InputLabel>
        <Select
          labelId="approach-select-label"
          id="approach-select"
          value={value}
          label="アプローチ"
          onChange={handleChange}
        >
          {approaches.map((approach) => (
            <MenuItem key={approach.id} value={approach.id}>
              {approach.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedApproach && (
        <Paper sx={{ mt: 2, p: 2 }} variant="outlined">
          {formatDescription(selectedApproach.description)}
        </Paper>
      )}
    </Box>
  );
};
