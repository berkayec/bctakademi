-- migrations/002_content.sql
-- BCT Akademi içerik tabloları
-- Güvenli: IF NOT EXISTS ile tekrar çalıştırılabilir

CREATE TABLE IF NOT EXISTS categories (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  sort_order   INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id           TEXT PRIMARY KEY,
  category_id  TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT,
  sort_order   INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS units (
  id                    TEXT PRIMARY KEY,
  course_id             TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  estimated_reading_time TEXT,
  sort_order            INTEGER DEFAULT 0,
  is_published          INTEGER DEFAULT 1,
  created_at            TEXT DEFAULT (datetime('now')),
  updated_at            TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS topics (
  id               TEXT PRIMARY KEY,
  unit_id          TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  content          TEXT,
  video_youtube_id TEXT,
  sort_order       INTEGER DEFAULT 0,
  is_published     INTEGER DEFAULT 1,
  created_at       TEXT DEFAULT (datetime('now')),
  updated_at       TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id       TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question       TEXT NOT NULL,
  options        TEXT NOT NULL, -- JSON array
  correct_answer INTEGER NOT NULL,
  explanation    TEXT,
  sort_order     INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  author       TEXT,
  category     TEXT,
  image_url    TEXT,
  read_time    TEXT,
  is_featured  INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS resources (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  type         TEXT NOT NULL, -- 'PDF' | 'Video' | 'Sunum'
  category     TEXT,
  file_size    TEXT,
  duration     TEXT,
  download_url TEXT,
  is_published INTEGER DEFAULT 1,
  created_at   TEXT DEFAULT (datetime('now')),
  updated_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_progress (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email  TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'topic' | 'unit' | 'video' | 'resource' | 'quiz'
  entity_id   TEXT NOT NULL,
  xp_earned   INTEGER DEFAULT 0,
  completed_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_email, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email   TEXT NOT NULL,
  topic_id     TEXT NOT NULL,
  score        INTEGER NOT NULL,
  total        INTEGER NOT NULL,
  completed_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_xp (
  user_email  TEXT PRIMARY KEY,
  total_xp    INTEGER DEFAULT 0,
  weekly_xp   INTEGER DEFAULT 0,
  monthly_xp  INTEGER DEFAULT 0,
  week_start  TEXT,
  month_start TEXT,
  updated_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_streaks (
  user_email    TEXT PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity  TEXT
);

-- İndeksler (sorgu hızı için)
CREATE INDEX IF NOT EXISTS idx_courses_category  ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_units_course       ON units(course_id);
CREATE INDEX IF NOT EXISTS idx_topics_unit        ON topics(unit_id);
CREATE INDEX IF NOT EXISTS idx_quiz_topic         ON quiz_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_email     ON user_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_progress_entity    ON user_progress(entity_type, entity_id);