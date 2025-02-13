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
('恋愛相談', '恋愛に関する悩みについて一緒に考えます。
例：
- 好きな人へのアプローチ方法
- 片思いの気持ちの整理
- 交際中の悩み
- 失恋からの立ち直り方
- 結婚についての不安や迷い'),

('キャリア相談', 'キャリアや仕事に関する課題を整理し、最適な選択を見つけます。
例：
- 転職についての判断
- スキルアップの方向性
- 職場での人間関係
- ワークライフバランス
- 起業・独立の検討'),

('人間関係', '友人、家族、職場など様々な人間関係の悩みを解決します。
例：
- 友人関係の悩み
- 家族との関係改善
- 職場でのコミュニケーション
- 新しい環境での人間関係作り
- 対人関係のストレス解消'),

('自己啓発', '自己成長や目標達成に向けたサポートを提供します。
例：
- 目標設定とその達成方法
- 新しい習慣の形成
- モチベーション維持
- 時間管理とプライオリティ設定
- マインドセットの改善'),

('メンタルヘルス', '心の健康維持と改善のためのサポートを行います。
例：
- ストレス管理
- 不安や焦りへの対処
- 自己肯定感の向上
- 感情コントロール
- リラックス方法の習得');

-- 初期データの投入：アプローチ
INSERT INTO approaches (name, description) VALUES
('共感的アプローチ', '相手の気持ちに寄り添い、感情を受け止めながら対話を進めます。
特徴：
- 積極的な傾聴と感情の承認
- 非判断的な態度での受容
- 気持ちの言語化のサポート
- 安心できる対話空間の創出
例：「つらい気持ちをよく分かります。もう少し詳しく教えていただけますか？」'),

('解決志向アプローチ', '問題の原因ではなく、解決策や目標に焦点を当てて対話を進めます。
特徴：
- 具体的な目標設定
- 成功体験の活用
- 実践可能な行動計画の立案
- 小さな進歩の重視
例：「理想の状態に近づくために、明日から始められることは何でしょうか？」'),

('質問型アプローチ', '適切な質問を通じて、自己理解と気づきを促します。
特徴：
- オープンクエスチョンの活用
- 深い自己洞察の促進
- 新しい視点の発見
- 思考の整理のサポート
例：「その選択に迷いを感じるのは、どのような理由からでしょうか？」'),

('チャレンジ型アプローチ', '新しい視点や行動を提案し、変化を促進します。
特徴：
- 建設的な異なる視点の提示
- 行動変容のための提案
- comfort zoneからの脱却支援
- 可能性の拡大
例：「これまでとは異なるアプローチとして、このような方法を試してみませんか？」'),

('ストーリーテリング型アプローチ', '例え話や経験談を通じて、理解と洞察を深めます。
特徴：
- 関連する事例の共有
- メタファーの活用
- 教訓やヒントの提示
- 共感的な理解の促進
例：「似たような状況を乗り越えた人の例をお話ししましょう...」'); 