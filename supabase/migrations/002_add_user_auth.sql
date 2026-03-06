-- Migration: Add user authentication to Grimoire
-- Run this AFTER deleting any existing test data (feeds + articles)
-- since the user_id NOT NULL constraint requires it.

-- 1. Add user_id column to feeds
ALTER TABLE feeds ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL;

-- 2. Add index for user_id lookups
CREATE INDEX idx_feeds_user_id ON feeds(user_id);

-- 3. Drop the unique constraint on url (now needs to be per-user)
ALTER TABLE feeds DROP CONSTRAINT feeds_url_key;

-- 4. Add compound unique constraint: same user can't subscribe to the same feed twice
ALTER TABLE feeds ADD CONSTRAINT feeds_url_user_unique UNIQUE (url, user_id);

-- 5. Drop old open policies
DROP POLICY "Allow all on feeds" ON feeds;
DROP POLICY "Allow all on articles" ON articles;

-- 6. Create user-scoped policy on feeds
CREATE POLICY "Users manage their own feeds"
  ON feeds FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Create user-scoped policy on articles (via feed ownership)
CREATE POLICY "Users manage their own articles"
  ON articles FOR ALL
  USING (
    feed_id IN (SELECT id FROM feeds WHERE user_id = auth.uid())
  )
  WITH CHECK (
    feed_id IN (SELECT id FROM feeds WHERE user_id = auth.uid())
  );
