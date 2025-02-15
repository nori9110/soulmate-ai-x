import React from 'react';
import { Snackbar, Button } from '@mui/material';
import { useUpdateNotification } from '../hooks/useUpdateNotification';

export const UpdateNotification: React.FC = () => {
  const { isUpdateAvailable, updateApp } = useUpdateNotification();

  return (
    <Snackbar
      open={isUpdateAvailable}
      message="新しいバージョンが利用可能です"
      action={
        <Button color="secondary" size="small" onClick={updateApp}>
          更新する
        </Button>
      }
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
};
