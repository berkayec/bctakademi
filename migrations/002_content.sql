-- ============================================================
-- BCT Akademi — Migration 002: İçerik + İlerleme + Leaderboard
-- Cloudflare D1'e uygulamak için:
--   wrangler d1 execute bctakademi-db --file=migrations/002_content.sql
-- ============================================================

-- ── Kategoriler (Alan Dersleri / Temel Dersler) ─────────────
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,       -- örn: "temel-dersler"
  title       TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now'))
);

-- ── Kurslar ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id           TEXT PRIMARY KEY,      -- örn: "yasam-destek"
  category_id  TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT DEFAULT '',
  image_url    TEXT DEFAULT '',
  sort_order   INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,     -- 0 = taslak, 1 = yayında
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);

-- ── Üniteler ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS units (
  id                   TEXT PRIMARY KEY,   -- örn: "yd-u-1"
  course_id            TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title                TEXT NOT NULL,
  description          TEXT DEFAULT '',
  estimated_reading_time TEXT DEFAULT '',
  sort_order           INTEGER DEFAULT 0,
  is_published         INTEGER DEFAULT 1,
  created_at           TEXT DEFAULT (datetime('now')),
  updated_at           TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_units_course ON units(course_id);

-- ── Konular ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS topics (
  id         TEXT PRIMARY KEY,             -- örn: "yd-t-1-1"
  unit_id    TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT DEFAULT '',              -- Markdown / HTML içerik
  sort_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_topics_unit ON topics(unit_id);

-- ── Quiz Soruları ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_questions (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id       TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question       TEXT NOT NULL,
  options        TEXT NOT NULL,            -- JSON array: ["A","B","C","D"]
  correct_answer INTEGER NOT NULL,         -- 0-indexed
  explanation    TEXT DEFAULT '',
  sort_order     INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_quiz_topic ON quiz_questions(topic_id);

-- ── Blog Yazıları ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  excerpt     TEXT DEFAULT '',
  content     TEXT DEFAULT '',            -- uzun içerik (Markdown)
  author      TEXT DEFAULT '',
  category    TEXT DEFAULT '',
  image_url   TEXT DEFAULT '',
  read_time   TEXT DEFAULT '',
  featured    INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  published_at TEXT DEFAULT (datetime('now')),
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);

-- ── Kaynaklar ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  type        TEXT NOT NULL CHECK(type IN ('PDF','Video','Sunum')),
  category    TEXT DEFAULT '',
  file_url    TEXT DEFAULT '',            -- R2 URL veya dış URL
  file_size   TEXT DEFAULT '',
  duration    TEXT DEFAULT '',           -- Video için süre
  is_published INTEGER DEFAULT 1,
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);

-- ── Kullanıcı İlerlemesi ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email      TEXT NOT NULL,
  entity_type     TEXT NOT NULL CHECK(entity_type IN ('topic','unit','video','resource','quiz')),
  entity_id       TEXT NOT NULL,
  completed       INTEGER DEFAULT 1,
  xp_earned       INTEGER DEFAULT 0,
  completed_at    TEXT DEFAULT (datetime('now')),
  UNIQUE(user_email, entity_type, entity_id)
);
CREATE INDEX IF NOT EXISTS idx_progress_user    ON user_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_progress_entity  ON user_progress(entity_type, entity_id);

-- ── Quiz Sonuçları ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_results (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email   TEXT NOT NULL,
  topic_id     TEXT NOT NULL,
  score        INTEGER NOT NULL,          -- doğru sayısı
  total        INTEGER NOT NULL,          -- toplam soru
  answers      TEXT DEFAULT '[]',         -- JSON: [{questionId, selected, correct}]
  xp_earned    INTEGER DEFAULT 0,
  taken_at     TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_qresults_user  ON quiz_results(user_email);
CREATE INDEX IF NOT EXISTS idx_qresults_topic ON quiz_results(topic_id);

-- ── XP Özet Tablosu (leaderboard için) ──────────────────────
-- user_progress'ten her giriş veya aksiyon sonrası güncellenir
CREATE TABLE IF NOT EXISTS user_xp (
  user_email     TEXT PRIMARY KEY,
  total_xp       INTEGER DEFAULT 0,
  weekly_xp      INTEGER DEFAULT 0,
  monthly_xp     INTEGER DEFAULT 0,
  week_start     TEXT DEFAULT (date('now','weekday 1','-7 days')),
  month_start    TEXT DEFAULT (strftime('%Y-%m-01','now')),
  last_active    TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_xp_total   ON user_xp(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_xp_weekly  ON user_xp(weekly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_xp_monthly ON user_xp(monthly_xp DESC);

-- ── Streak (Ardışık Gün) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_streaks (
  user_email       TEXT PRIMARY KEY,
  current_streak   INTEGER DEFAULT 0,
  longest_streak   INTEGER DEFAULT 0,
  last_active_date TEXT DEFAULT (date('now'))
);
