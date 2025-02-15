import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { Profile } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { SelectChangeEvent } from '@mui/material/Select';
import ChatIcon from '@mui/icons-material/Chat';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onProfileUpdate: () => void;
  isEdit?: boolean;
}

const AGE_GROUPS = ['10代', '20代', '30代', '40代', '50代以上', '未回答'] as const;
const GENDERS = ['男性', '女性', 'その他', '未回答'] as const;
const INTEREST_OPTIONS = [
  '読書',
  '音楽',
  '映画',
  'スポーツ',
  '料理',
  '旅行',
  'テクノロジー',
  'アート',
  'ファッション',
  '健康',
  '教育',
  'ビジネス',
];

export const ProfileDialog: React.FC<ProfileDialogProps> = ({
  open,
  onClose,
  userId,
  onProfileUpdate,
  isEdit = false,
}) => {
  const initialProfile = useMemo(
    () => ({
      username: '',
      age_group: '未回答' as const,
      gender: '未回答' as const,
      occupation: null,
      interests: [],
      bio: null,
    }),
    []
  );

  const [profile, setProfile] = useState<Partial<Profile>>(initialProfile);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setError('ユーザーIDが見つかりません。');
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        // eslint-disable-next-line no-console
        console.error('Profile fetch error:', fetchError);
        throw fetchError;
      }

      if (data) {
        setProfile(data);
      } else {
        const newProfile = {
          ...initialProfile,
          id: userId,
        };
        setProfile(newProfile);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Profile load error:', error);
      setProfile(initialProfile);
      setError('プロフィールの読み込みに失敗しました。');
    }
  }, [userId, initialProfile]);

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open, loadProfile]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError('画像サイズは2MB以下にしてください。');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !userId) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    try {
      // 古いアバター画像を削除
      if (profile.avatar_url) {
        const oldFilePath = profile.avatar_url.split('/').pop();
        if (oldFilePath) {
          await supabase.storage.from('avatars').remove([oldFilePath]);
        }
      }

      // 新しいアバター画像をアップロード
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      // エラーを上位で処理するために再スロー
      throw error;
    }
  };

  const handleSave = async () => {
    if (!userId) {
      setError('ユーザーIDが見つかりません。');
      return;
    }

    if (!profile.username) {
      setError('ユーザー名は必須です。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const profileData = {
        id: userId,
        username: profile.username,
        age_group: profile.age_group || '未回答',
        gender: profile.gender || '未回答',
        occupation: profile.occupation || '',
        interests: profile.interests || [],
        bio: profile.bio || '',
        avatar_url: avatarUrl,
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (upsertError) throw upsertError;

      await onProfileUpdate();
      onClose();
    } catch (error) {
      console.error('Profile save error:', error);
      setError('プロフィールの保存に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = profile.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    setProfile({ ...profile, interests: newInterests });
  };

  const handleAgeGroupChange = (e: SelectChangeEvent) => {
    setProfile({ ...profile, age_group: e.target.value as Profile['age_group'] });
  };

  const handleGenderChange = (e: SelectChangeEvent) => {
    setProfile({ ...profile, gender: e.target.value as Profile['gender'] });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'プロフィールを編集' : 'プロフィールを設定'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={avatarPreview || profile.avatar_url || undefined}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton color="primary" aria-label="アバターをアップロード" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <Typography variant="caption" display="block" color="text.secondary">
                2MB以下の画像をアップロード
              </Typography>
            </Box>
          </Box>
          {profile.prompt_count !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<ChatIcon />}
                label={`総プロンプト数: ${profile.prompt_count.toLocaleString()}回`}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
          <TextField
            label="ユーザー名"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            required
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>年代</InputLabel>
            <Select value={profile.age_group} onChange={handleAgeGroupChange} label="年代">
              {AGE_GROUPS.map((age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>性別</InputLabel>
            <Select value={profile.gender} onChange={handleGenderChange} label="性別">
              {GENDERS.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="職業"
            value={profile.occupation || ''}
            onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
            fullWidth
          />
          <Box>
            <InputLabel sx={{ mb: 1 }}>興味・関心</InputLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {INTEREST_OPTIONS.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  onClick={() => handleInterestToggle(interest)}
                  color={profile.interests?.includes(interest) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
          <TextField
            label="自己紹介"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          キャンセル
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? '保存中...' : isEdit ? '更新' : '設定'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
