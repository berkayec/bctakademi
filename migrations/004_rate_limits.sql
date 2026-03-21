-- ============================================================
-- BCT Akademi — Migration 004: Rate Limiting Tablosu
-- Çalıştır:
--   wrangler d1 execute bctakademi-db --file=migrations/004_rate_limits.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  attempts     INTEGER NOT NULL DEFAULT 0,
  window_start TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Periyodik temizleme için index
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);
