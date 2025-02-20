import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { Theme } from '../types/database.types';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || '', // サービスロールキーを使用
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const themes: Omit<Theme, 'icon'>[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'フリー',
    description: '特定のテーマにとらわれず、自由に話し合いたい内容について対話します。',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: '将来への不安',
    description: '将来の不安や悩みについて一緒に考え、解決策を見つけます。',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'お金に関して',
    description: '家計、投資、貯金など、お金に関する相談に応じます。',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: '仕事・就職',
    description: '仕事や就職に関する悩みについてアドバイスします。',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: '人間関係',
    description: '友人、家族、職場など、人間関係の悩みを解決します。',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    name: '学校成績・進学',
    description: '学業や進学に関する相談に応じます。',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    name: '容姿・健康',
    description: '健康管理や外見に関する相談に応じます。',
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    name: '政治・社会問題',
    description: '現代社会の課題について一緒に考えます。',
    created_at: new Date().toISOString(),
  },
];

async function updateThemes() {
  try {
    // 既存のテーマを全て削除
    const { error: deleteError } = await supabase
      .from('themes')
      .delete()
      .gte('created_at', '2000-01-01');
    if (deleteError) {
      console.error('テーマの削除に失敗しました:', deleteError);
      return;
    }

    // 新しいテーマを挿入
    const { error: insertError } = await supabase.from('themes').insert(themes);

    if (insertError) {
      console.error('テーマの挿入に失敗しました:', insertError);
      return;
    }

    console.log('テーマの更新が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// メインの実行
updateThemes();
