-- Create themes table
CREATE TABLE themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create approaches table
CREATE TABLE approaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN ('user', 'assistant')),
    theme_id UUID REFERENCES themes(id),
    approach_id UUID REFERENCES approaches(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX messages_user_id_idx ON messages(user_id);
CREATE INDEX messages_theme_id_idx ON messages(theme_id);
CREATE INDEX messages_approach_id_idx ON messages(approach_id);

-- Enable Row Level Security
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE approaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "全ユーザーに対してテーマの読み取りを許可" ON themes FOR SELECT USING (true);
CREATE POLICY "全ユーザーに対してアプローチの読み取りを許可" ON approaches FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみメッセージの作成を許可" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "メッセージ所有者のみ読み取りを許可" ON messages FOR SELECT USING (auth.uid() = user_id);

-- Create auth.users table
CREATE TABLE auth.users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "ユーザーは自身のデータのみアクセス可能" ON auth.users
    FOR ALL USING (auth.uid() = id);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    username VARCHAR NOT NULL,
    age_group VARCHAR CHECK (age_group IN ('10代', '20代', '30代', '40代', '50代以上')) NOT NULL,
    gender VARCHAR CHECK (gender IN ('男性', '女性', 'その他', '未回答')) NOT NULL,
    occupation VARCHAR,
    interests TEXT[],
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "プロフィールの参照は全ユーザーに許可" ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "プロフィールの更新は本人のみ許可" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "プロフィールの作成は本人のみ許可" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 初期データの投入：テーマ
INSERT INTO themes (name, description) VALUES
('恋愛相談', '恋愛に関する悩みや相談について話し合います'),
('キャリア相談', 'キャリアや仕事に関する悩みについて話し合います'),
('人間関係', '友人や家族との関係について話し合います'),
('自己啓発', '自己成長や目標達成について話し合います'),
('メンタルヘルス', 'メンタルヘルスや心の健康について話し合います');

-- 初期データの投入：アプローチ
INSERT INTO approaches (name, description) VALUES
('共感的アプローチ', '相手の気持ちに寄り添い、理解を示しながら対話を進めます'),
('解決志向アプローチ', '具体的な解決策を見つけることに焦点を当てて対話を進めます'),
('質問型アプローチ', '質問を通じて相手の考えを深めていくように対話を進めます'),
('チャレンジ型アプローチ', '新しい視点や考え方を提示しながら対話を進めます'),
('ストーリーテリング型アプローチ', '例え話や経験談を交えながら対話を進めます'); 