-- Active: 1684920284634@@ep-mute-night-390388-pooler.us-west-2.aws.neon.tech@5432@neondb
-- Add migration script here
CREATE TABLE view_counts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0
);