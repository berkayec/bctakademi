-- ============================================================
-- BCT Akademi — Migration 005: Topic Attachments & Video
-- Çalıştır:
--   wrangler d1 execute bctakademi-db --file=migrations/005_topic_attachments.sql
-- ============================================================

-- topics tablosuna attachment ve video alanları ekle
ALTER TABLE topics ADD COLUMN video_youtube_id TEXT DEFAULT '';
ALTER TABLE topics ADD COLUMN attachment_url TEXT DEFAULT '';
