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
  Avatar,
} from '@mui/material';
import { AccountCircle, Edit } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileDialog } from '../Profile/ProfileDialog';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types/database.types';
import { useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  // パスに基づいて背景色を決定
  const isTransparent =
    !location.pathname.includes('/chat') && !location.pathname.includes('/theme-selection');

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
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexGrow: 1,
              fontFamily: "'Adobe Mining Std', 'Montserrat', sans-serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#FFFFFF',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                borderRadius: '4px',
                zIndex: 1,
              },
              '&:hover::after': {
                opacity: 1,
              },
              transition: 'all 0.3s ease',
            }}
          >
            <span>soulmate ~</span>
            <span
              style={{
                fontFamily: "'Possion One', cursive",
                letterSpacing: '0.1em',
              }}
            >
              KAGUYA
            </span>
            <span>~ moon vision</span>
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
                  {profile?.avatar_url ? (
                    <Avatar src={profile.avatar_url} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircle />
                  )}
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
