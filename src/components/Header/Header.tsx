import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Badge,
  Button,
  Alert,
  Tooltip,
} from '@mui/material';
import { AccountCircle, Edit } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileDialog } from '../Profile/ProfileDialog';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types/database.types';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);

      if (!data?.username) {
        setProfileDialogOpen(true);
      }
    } catch (error) {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    setProfileDialogOpen(true);
  };

  const handleSignOut = () => {
    handleClose();
    signOut();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SoulMate Chat
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {profile?.username ? (
                  <>
                    <Typography variant="body1">{profile.username}</Typography>
                    <Tooltip title="プロフィールを編集">
                      <IconButton
                        size="small"
                        onClick={() => setProfileDialogOpen(true)}
                        color="inherit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Button
                    color="inherit"
                    onClick={() => setProfileDialogOpen(true)}
                    size="small"
                    sx={{ textTransform: 'none' }}
                    startIcon={<Edit />}
                  >
                    プロフィールを設定
                  </Button>
                )}
              </Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Badge color="error" variant="dot" invisible={!!profile?.username}>
                  <AccountCircle />
                </Badge>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfileClick}>
                  {profile?.username ? 'プロフィールを編集' : 'プロフィールを設定'}
                </MenuItem>
                <MenuItem onClick={handleSignOut}>ログアウト</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {user && !profile?.username && (
        <Alert
          severity="info"
          sx={{
            borderRadius: 0,
            '& .MuiAlert-message': {
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          }}
        >
          <span>プロフィールを設定して、より良いチャット体験を始めましょう。</span>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setProfileDialogOpen(true)}
            sx={{ ml: 2 }}
          >
            設定する
          </Button>
        </Alert>
      )}
      <ProfileDialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        userId={user?.id || ''}
        onProfileUpdate={loadProfile}
        isEdit={!!profile?.username}
      />
    </>
  );
};
