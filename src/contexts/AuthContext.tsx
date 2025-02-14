import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// 環境に応じたリダイレクトURLを設定
const getRedirectUrl = () => {
  // 本番環境のURLを環境変数から取得
  const publicUrl = process.env.REACT_APP_PUBLIC_URL;
  const nodeEnv = process.env.NODE_ENV;
  const hostname = window.location.hostname;

  // デバッグ用ログ出力
  console.log('Environment Variables:', {
    NODE_ENV: nodeEnv,
    REACT_APP_PUBLIC_URL: publicUrl,
    hostname,
    isProduction: nodeEnv === 'production' || hostname === 'soulmate-ai-ten.vercel.app'
  });

  // 本番環境の場合は、設定されたURLを使用
  if (nodeEnv === 'production' || hostname === 'soulmate-ai-ten.vercel.app') {
    const redirectUrl = 'https://soulmate-ai-ten.vercel.app';
    console.log('Production redirect URL:', redirectUrl);
    return redirectUrl;
  }

  // 開発環境の場合
  console.log('Development redirect URL: http://localhost:3000');
  return 'http://localhost:3000';
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  sessionStartTime: string | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // セッションの初期化
    const initSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession) {
          setSessionStartTime(new Date().toISOString());
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('セッションの初期化に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // セッション状態の監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        setSessionStartTime(new Date().toISOString());
      } else {
        setSessionStartTime(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl(),
          data: {
            timestamp: new Date().toISOString(),
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('サインアップエラー:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('サインインエラー:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSessionStartTime(null);
      setUser(null);
      setSession(null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('サインアウトエラー:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        sessionStartTime,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
