-- Drop approach-related indexes and foreign keys
DROP INDEX IF EXISTS messages_approach_id_idx;
ALTER TABLE messages DROP COLUMN IF EXISTS approach_id;

-- Drop approaches table
DROP TABLE IF EXISTS approaches;

-- Remove approach-related policies
DROP POLICY IF EXISTS "全ユーザーに対してアプローチの読み取りを許可" ON approaches; 