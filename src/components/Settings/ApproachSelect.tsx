import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Approach } from '../../types/database.types';
import { supabase } from '../../lib/supabase';

interface ApproachSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApproachSelect: React.FC<ApproachSelectProps> = ({ value, onChange }) => {
  const [approaches, setApproaches] = useState<Approach[]>([]);

  useEffect(() => {
    loadApproaches();
  }, []);

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

  return (
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
  );
};
