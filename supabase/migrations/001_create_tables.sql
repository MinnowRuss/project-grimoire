-- Grimoire RSS Reader — Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Feeds table
create table if not exists feeds (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  title text not null,
  description text,
  favicon_url text,
  last_fetched_at timestamptz,
  created_at timestamptz default now()
);

-- Articles table
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  feed_id uuid references feeds(id) on delete cascade not null,
  guid text not null,
  title text not null,
  url text,
  author text,
  published_at timestamptz,
  thumbnail_url text,
  summary text,
  content text,
  is_summary_only boolean default false,
  is_read boolean default false,
  created_at timestamptz default now(),
  unique(feed_id, guid)
);

-- Indexes for performance
create index if not exists idx_articles_published on articles(published_at desc);
create index if not exists idx_articles_feed_id on articles(feed_id);

-- Row Level Security (open for now — no auth)
alter table feeds enable row level security;
alter table articles enable row level security;

-- Allow all operations (single-user app, no auth)
create policy "Allow all on feeds" on feeds for all using (true) with check (true);
create policy "Allow all on articles" on articles for all using (true) with check (true);
