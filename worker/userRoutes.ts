import { Hono } from "hono";
import { Env } from './core-utils';

// ═══════════════════════════════════════════════════════════════════════════
// YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════════════════════════════════════

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/\0/g, '').trim().slice(0, 255);
}

function nanoid(len = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < len; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function getAdminKeyFromRequest(req: Request): string | null {
  const auth = req.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

function checkAdminKey(key: string | null, env: Env): boolean {
  if (!key || !env.ADMIN_KEY) return false;
  return timingSafeEqual(key, env.ADMIN_KEY);
}

// ═══════════════════════════════════════════════════════════════════════════
// ROTALAR
// ═══════════════════════════════════════════════════════════════════════════

export function userRoutes(app: Hono<{ Bindings: Env }>) {

  // ─────────────────────────────────────────────────────────────────────────
  // GENEL / İLETİŞİM
  // ─────────────────────────────────────────────────────────────────────────

  app.post('/api/contact', async (c) => {
    try {
      const body    = await c.req.json();
      const name    = sanitize(body.name);
      const email   = sanitize(body.email).toLowerCase();
      const subject = sanitize(body.subject);
      const message = typeof body.message === 'string' ? body.message.slice(0, 5000) : '';

      if (!name || !email || !subject || !message) {
        return c.json({ success: false, error: 'Tüm alanları doldurun.' }, 400);
      }

      if (c.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${c.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'BCT Akademi İletişim <noreply@bctakademi.com>',
            to: ['destek@bctakademi.com'],
            reply_to: email,
            subject: `[İletişim] ${subject}`,
            html: `<p><b>Ad:</b> ${name}</p><p><b>E-posta:</b> ${email}</p><p><b>Konu:</b> ${subject}</p><p><b>Mesaj:</b><br/>${message.replace(/\n/g, '<br/>')}</p>`,
          }),
        });
      }

      return c.json({ success: true });
    } catch (error: unknown) {
      console.error('[contact]', error);
      return c.json({ success: false, error: 'Mesaj gönderilemedi.' }, 500);
    }
  });

  app.post('/api/client-errors', async (c) => {
    try {
      const body = await c.req.json().catch(() => ({}));
      console.error('[client-error]', JSON.stringify(body).slice(0, 2000));
      return c.json({ success: true });
    } catch {
      return c.json({ success: true });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // İÇERİK API'LERİ (public — herkes okur)
  // ─────────────────────────────────────────────────────────────────────────

  app.get('/api/curriculum', async (c) => {
    try {
      const categories = await c.env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
      const courses    = await c.env.DB.prepare(
        'SELECT * FROM courses WHERE is_published = 1 ORDER BY category_id, sort_order ASC'
      ).all();
      const units = await c.env.DB.prepare(
        'SELECT id, course_id, title, description, estimated_reading_time, sort_order FROM units WHERE is_published = 1 ORDER BY course_id, sort_order ASC'
      ).all();

      const unitsByCourse: Record<string, unknown[]> = {};
      for (const u of (units.results as any[])) {
        if (!unitsByCourse[u.course_id]) unitsByCourse[u.course_id] = [];
        unitsByCourse[u.course_id].push(u);
      }

      const coursesByCategory: Record<string, unknown[]> = {};
      for (const course of (courses.results as any[])) {
        const enriched = { ...course, units: unitsByCourse[course.id] ?? [] };
        if (!coursesByCategory[course.category_id]) coursesByCategory[course.category_id] = [];
        coursesByCategory[course.category_id].push(enriched);
      }

      const result = (categories.results as any[]).map(cat => ({
        ...cat,
        courses: coursesByCategory[cat.id] ?? [],
      }));

      return c.json({ success: true, data: result });
    } catch (error: unknown) {
      console.error('[curriculum]', error);
      return c.json({ success: false, error: 'Müfredat yüklenemedi.' }, 500);
    }
  });

  app.get('/api/units/:unitId/topics', async (c) => {
    try {
      const { unitId } = c.req.param();
      if (!/^[a-zA-Z0-9_-]+$/.test(unitId)) return c.json({ success: false, error: 'Geçersiz ünite ID.' }, 400);

      const topics = await c.env.DB.prepare(
        `SELECT id, unit_id, title, content, video_youtube_id, attachment_url, sort_order, is_published
         FROM topics
         WHERE unit_id = ? AND is_published = 1
         ORDER BY sort_order ASC`
      ).bind(unitId).all();

      const quizzes = await c.env.DB.prepare(
        `SELECT q.* FROM quiz_questions q
         INNER JOIN topics t ON q.topic_id = t.id
         WHERE t.unit_id = ? ORDER BY q.topic_id, q.sort_order ASC`
      ).bind(unitId).all();

      const quizByTopic: Record<string, unknown[]> = {};
      for (const q of (quizzes.results as any[])) {
        const options = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options ?? []);
        if (!quizByTopic[q.topic_id]) quizByTopic[q.topic_id] = [];
        quizByTopic[q.topic_id].push({ ...q, options });
      }

      const result = (topics.results as any[]).map(t => ({
        ...t,
        video_youtube_id: t.video_youtube_id || '',
        attachment_url:   t.attachment_url   || '',
        quiz: quizByTopic[t.id] ?? [],
      }));

      return c.json({ success: true, data: result });
    } catch (error: unknown) {
      console.error('[topics]', error);
      return c.json({ success: false, error: 'Konular yüklenemedi.' }, 500);
    }
  });

  app.get('/api/blog', async (c) => {
    try {
      const posts = await c.env.DB.prepare(
        'SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC'
      ).all();
      return c.json({ success: true, data: posts.results });
    } catch (error: unknown) {
      console.error('[blog]', error);
      return c.json({ success: false, error: 'Blog yüklenemedi.' }, 500);
    }
  });

  app.get('/api/resources', async (c) => {
    try {
      const resources = await c.env.DB.prepare(
        'SELECT * FROM resources WHERE is_published = 1 ORDER BY created_at DESC'
      ).all();
      return c.json({ success: true, data: resources.results });
    } catch (error: unknown) {
      console.error('[resources]', error);
      return c.json({ success: false, error: 'Kaynaklar yüklenemedi.' }, 500);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN CMS — Kategori / Kurs / Ünite / Konu
  // ─────────────────────────────────────────────────────────────────────────

  app.get('/api/admin/categories', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  app.post('/api/admin/categories', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body  = await c.req.json();
      const id    = sanitize(body.id) || nanoid();
      const title = sanitize(body.title);
      const sort  = Number(body.sort_order) || 0;
      if (!title) return c.json({ error: 'Başlık gerekli.' }, 400);
      await c.env.DB.prepare('INSERT INTO categories (id, title, sort_order) VALUES (?, ?, ?)').bind(id, title, sort).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.put('/api/admin/categories/:id', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const { id } = c.req.param();
      await c.env.DB.prepare('UPDATE categories SET title = ?, sort_order = ? WHERE id = ?')
        .bind(sanitize(body.title), Number(body.sort_order) || 0, id).run();
      return c.json({ success: true });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.delete('/api/admin/categories/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  app.get('/api/admin/courses', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM courses ORDER BY category_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  app.post('/api/admin/courses', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body        = await c.req.json();
      const id          = sanitize(body.id) || nanoid();
      const categoryId  = sanitize(body.category_id);
      const title       = sanitize(body.title);
      const description = typeof body.description === 'string' ? body.description.slice(0, 2000) : '';
      const imageUrl    = sanitize(body.image_url);
      const sort        = Number(body.sort_order) || 0;
      const published   = body.is_published !== false ? 1 : 0;
      if (!categoryId || !title) return c.json({ error: 'Kategori ve başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO courses (id, category_id, title, description, image_url, sort_order, is_published) VALUES (?,?,?,?,?,?,?)'
      ).bind(id, categoryId, title, description, imageUrl, sort, published).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.put('/api/admin/courses/:id', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE courses SET category_id=?, title=?, description=?, image_url=?, sort_order=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.category_id), sanitize(body.title),
        typeof body.description === 'string' ? body.description.slice(0, 2000) : '',
        sanitize(body.image_url), Number(body.sort_order) || 0,
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.delete('/api/admin/courses/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  app.get('/api/admin/units', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const courseId = c.req.query('course_id');
    const r = courseId
      ? await c.env.DB.prepare('SELECT * FROM units WHERE course_id = ? ORDER BY sort_order ASC').bind(courseId).all()
      : await c.env.DB.prepare('SELECT * FROM units ORDER BY course_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  app.post('/api/admin/units', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body     = await c.req.json();
      const id       = sanitize(body.id) || nanoid();
      const courseId = sanitize(body.course_id);
      const title    = sanitize(body.title);
      const desc     = typeof body.description === 'string' ? body.description.slice(0, 1000) : '';
      const readTime = sanitize(body.estimated_reading_time);
      const sort     = Number(body.sort_order) || 0;
      const pub      = body.is_published !== false ? 1 : 0;
      if (!courseId || !title) return c.json({ error: 'Kurs ve başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO units (id, course_id, title, description, estimated_reading_time, sort_order, is_published) VALUES (?,?,?,?,?,?,?)'
      ).bind(id, courseId, title, desc, readTime, sort, pub).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.put('/api/admin/units/:id', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE units SET course_id=?, title=?, description=?, estimated_reading_time=?, sort_order=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.course_id), sanitize(body.title),
        typeof body.description === 'string' ? body.description.slice(0, 1000) : '',
        sanitize(body.estimated_reading_time),
        Number(body.sort_order) || 0,
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.delete('/api/admin/units/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM units WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  app.get('/api/admin/topics', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const unitId = c.req.query('unit_id');
    const r = unitId
      ? await c.env.DB.prepare(
          'SELECT id, unit_id, title, content, video_youtube_id, attachment_url, sort_order, is_published FROM topics WHERE unit_id = ? ORDER BY sort_order ASC'
        ).bind(unitId).all()
      : await c.env.DB.prepare(
          'SELECT id, unit_id, title, content, video_youtube_id, attachment_url, sort_order, is_published FROM topics ORDER BY unit_id, sort_order ASC'
        ).all();
    return c.json({ success: true, data: r.results });
  });

  app.post('/api/admin/topics', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body           = await c.req.json();
      const id             = sanitize(body.id) || nanoid();
      const unitId         = sanitize(body.unit_id);
      const title          = sanitize(body.title);
      const content        = typeof body.content === 'string' ? body.content.slice(0, 50000) : '';
      const videoYoutubeId = sanitize(body.video_youtube_id || '');
      const attachmentUrl  = typeof body.attachment_url === 'string' ? body.attachment_url.slice(0, 1000) : '';
      const sort           = Number(body.sort_order) || 0;
      const pub            = body.is_published !== false ? 1 : 0;
      if (!unitId || !title) return c.json({ error: 'Ünite ve başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO topics (id, unit_id, title, content, video_youtube_id, attachment_url, sort_order, is_published) VALUES (?,?,?,?,?,?,?,?)'
      ).bind(id, unitId, title, content, videoYoutubeId, attachmentUrl, sort, pub).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.put('/api/admin/topics/:id', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE topics
         SET unit_id=?, title=?, content=?, video_youtube_id=?, attachment_url=?, sort_order=?, is_published=?, updated_at=datetime('now')
         WHERE id=?`
      ).bind(
        sanitize(body.unit_id),
        sanitize(body.title),
        typeof body.content === 'string' ? body.content.slice(0, 50000) : '',
        sanitize(body.video_youtube_id || ''),
        typeof body.attachment_url === 'string' ? body.attachment_url.slice(0, 1000) : '',
        Number(body.sort_order) || 0,
        body.is_published !== false ? 1 : 0,
        id
      ).run();
      return c.json({ success: true });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.delete('/api/admin/topics/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM topics WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN CMS — Blog
  // ─────────────────────────────────────────────────────────────────────────

  app.get('/api/admin/blog', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY published_at DESC').all();
    return c.json({ success: true, data: r.results });
  });

  app.post('/api/admin/blog', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body  = await c.req.json();
      const id    = sanitize(body.id) || nanoid();
      const title = sanitize(body.title);
      if (!title) return c.json({ error: 'Başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        `INSERT INTO blog_posts (id, title, excerpt, content, author, category, image_url, read_time, featured, is_published, published_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        id, title,
        typeof body.excerpt === 'string' ? body.excerpt.slice(0, 500) : '',
        typeof body.content === 'string' ? body.content.slice(0, 100000) : '',
        sanitize(body.author), sanitize(body.category), sanitize(body.image_url),
        sanitize(body.read_time), body.featured ? 1 : 0,
        body.is_published !== false ? 1 : 0,
        body.published_at || new Date().toISOString()
      ).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.put('/api/admin/blog/:id', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE blog_posts SET title=?, excerpt=?, content=?, author=?, category=?, image_url=?, read_time=?, featured=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.title),
        typeof body.excerpt === 'string' ? body.excerpt.slice(0, 500) : '',
        typeof body.content === 'string' ? body.content.slice(0, 100000) : '',
        sanitize(body.author), sanitize(body.category), sanitize(body.image_url),
        sanitize(body.read_time), body.featured ? 1 : 0,
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.delete('/api/admin/blog/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN CMS — Kaynaklar
  // ─────────────────────────────────────────────────────────────────────────

  app.get('/api/admin/resources', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM resources ORDER BY created_at DESC').all();
    return c.json({ success: true, data: r.results });
  });

  app.post('/api/admin/resources', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const id   = sanitize(body.id) || nanoid();
      const type = sanitize(body.type);
      if (!['PDF', 'Video', 'Sunum'].includes(type)) return c.json({ error: 'Geçersiz tür.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO resources (id, title, description, type, category, file_url, file_size, duration, is_published) VALUES (?,?,?,?,?,?,?,?,?)'
      ).bind(
        id, sanitize(body.title),
        typeof body.description === 'string' ? body.description.slice(0, 1000) : '',
        type, sanitize(body.category), sanitize(body.file_url),
        sanitize(body.file_size), sanitize(body.duration),
        body.is_published !== false ? 1 : 0
      ).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.put('/api/admin/resources/:id', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE resources SET title=?, description=?, type=?, category=?, file_url=?, file_size=?, duration=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.title),
        typeof body.description === 'string' ? body.description.slice(0, 1000) : '',
        sanitize(body.type), sanitize(body.category), sanitize(body.file_url),
        sanitize(body.file_size), sanitize(body.duration),
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  app.delete('/api/admin/resources/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // R2 DOSYA YÜKLEME
  // ─────────────────────────────────────────────────────────────────────────

  app.post('/api/upload', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || authHeader !== `Bearer ${c.env.ADMIN_KEY}`) {
      return c.json({ error: 'Yetkisiz.' }, 401);
    }
    if (!c.env.BUCKET) {
      return c.json({ error: "R2 bucket bağlı değil. wrangler.jsonc'yi kontrol edin." }, 500);
    }
    try {
      const formData = await c.req.formData();
      const file = formData.get('file') as File | null;
      if (!file) return c.json({ error: 'Dosya bulunamadı.' }, 400);

      const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
      const safeExt = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'webm'].includes(ext)
        ? ext : 'bin';
      const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

      await c.env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || 'application/octet-stream' },
      });

      const url = `https://pub-5921cdf12f744e97a1a20e32a9d1bfae.r2.dev/${key}`;
      return c.json({ success: true, url, key });
    } catch (e: unknown) {
      console.error('[upload]', e);
      return c.json({ error: (e as Error).message }, 500);
    }
  });
}
