import { Hono } from "hono";
import { Env } from './core-utils';

// ─── Kullanıcıya doğrulama kodu gönder ─────────────────────────────────────
async function sendVerificationEmail(
  env: Env,
  to: string,
  username: string,
  code: string
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BCT Akademi <noreply@bctakademi.com>',
      to: [to],
      reply_to: 'destek@bctakademi.com',
      subject: 'BCT Akademi — E-posta Doğrulama Kodun',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#0f172a">Merhaba ${username} 👋</h2>
          <p style="color:#475569">BCT Akademi'ye kaydın için e-posta adresini doğrulaman gerekiyor.</p>
          <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:16px;padding:24px;text-align:center;margin:24px 0">
            <p style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Doğrulama Kodun</p>
            <p style="font-size:40px;font-weight:900;letter-spacing:.3em;color:#0f172a;margin:0">${code}</p>
          </div>
          <p style="color:#94a3b8;font-size:12px">Bu kod 15 dakika geçerlidir. Eğer bu işlemi sen başlatmadıysan bu e-postayı görmezden gelebilirsin.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
          <p style="color:#cbd5e1;font-size:11px;text-align:center">Sorularınız için: <a href="mailto:destek@bctakademi.com" style="color:#f97316">destek@bctakademi.com</a></p>
        </div>
      `,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API hatası: ${err}`);
  }
}

// ─── Admin'e yeni kayıt bildirimi gönder ────────────────────────────────────
async function sendAdminNotification(
  env: Env,
  username: string,
  email: string,
  role: string,
  detail: string
): Promise<void> {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BCT Akademi Sistem <noreply@bctakademi.com>',
      to: ['destek@bctakademi.com', 'bctakademidestek@gmail.com'],
      subject: `[Yeni Başvuru] ${username} — Admin Onayı Bekliyor`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <div style="background:#f97316;border-radius:12px;padding:16px 24px;margin-bottom:24px">
            <h2 style="color:#fff;margin:0">🔔 Yeni Üyelik Başvurusu</h2>
          </div>
          <p style="color:#475569">E-postasını doğrulayan bir kullanıcı admin onayı bekliyor.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr style="background:#f8fafc">
              <td style="padding:12px 16px;font-weight:700;color:#64748b;width:120px">Ad Soyad</td>
              <td style="padding:12px 16px;color:#0f172a;font-weight:600">${username}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#64748b">E-posta</td>
              <td style="padding:12px 16px;color:#0f172a">${email}</td>
            </tr>
            <tr style="background:#f8fafc">
              <td style="padding:12px 16px;font-weight:700;color:#64748b">Rol</td>
              <td style="padding:12px 16px;color:#0f172a">${role}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#64748b">Detay</td>
              <td style="padding:12px 16px;color:#0f172a">${detail || '—'}</td>
            </tr>
          </table>
          <div style="margin-top:32px;text-align:center">
            <a href="https://bctakademi.com/admin-control-portal?key=${env.ADMIN_KEY}"
               style="background:#0f172a;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">
              Admin Paneline Git →
            </a>
          </div>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px;text-align:center">Bu mail otomatik gönderilmiştir.</p>
        </div>
      `,
    }),
  });
}

// ─── Yardımcılar ────────────────────────────────────────────────────────────
function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 255);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function nanoid(len = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < len; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// ─── XP güncelleme yardımcısı ────────────────────────────────────────────────
async function addXP(env: Env, userEmail: string, amount: number): Promise<void> {
  // Haftalık/aylık sıfırlama mantığı SQL'de yapılıyor
  await env.DB.prepare(`
    INSERT INTO user_xp (user_email, total_xp, weekly_xp, monthly_xp)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_email) DO UPDATE SET
      total_xp   = total_xp + excluded.total_xp,
      weekly_xp  = CASE
        WHEN week_start < date('now','weekday 1','-7 days')
          THEN excluded.weekly_xp
          ELSE weekly_xp + excluded.weekly_xp
        END,
      monthly_xp = CASE
        WHEN month_start < strftime('%Y-%m-01','now')
          THEN excluded.monthly_xp
          ELSE monthly_xp + excluded.monthly_xp
        END,
      week_start  = date('now','weekday 1','-7 days'),
      month_start = strftime('%Y-%m-01','now'),
      last_active = datetime('now')
  `).bind(userEmail, amount, amount, amount).run();
}

// ─── Rotalar ────────────────────────────────────────────────────────────────
export function userRoutes(app: Hono<{ Bindings: Env }>) {

  // ══════════════════════════════════════════════════════════════════════════
  // AUTH ENDPOİNT'LERİ (mevcut — değiştirilmedi)
  // ══════════════════════════════════════════════════════════════════════════

  // POST /api/signup
  app.post('/api/signup', async (c) => {
    try {
      const body     = await c.req.json();
      const username = sanitize(body.username);
      const email    = sanitize(body.email).toLowerCase();
      const role     = sanitize(body.role);
      const detail   = sanitize(body.detail);

      if (!username || !email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz isim veya e-posta.' }, 400);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const existing = await c.env.DB.prepare(
        'SELECT id, status FROM users WHERE email = ?'
      ).bind(email).first();

      if (existing) {
        if (existing.status === 'active') {
          return c.json({ success: false, error: 'Bu e-posta zaten aktif bir hesaba sahip.' }, 400);
        }
        await c.env.DB.prepare(
          `UPDATE users SET verification_code = ?, code_expires_at = datetime('now', '+15 minutes') WHERE email = ?`
        ).bind(code, email).run();
      } else {
        await c.env.DB.prepare(
          `INSERT INTO users (username, email, role, detail, verification_code, code_expires_at, status)
           VALUES (?, ?, ?, ?, ?, datetime('now', '+15 minutes'), 'pending_email')`
        ).bind(username, email, role, detail, code).run();
      }

      await sendVerificationEmail(c.env, email, username, code);
      return c.json({ success: true, message: 'Doğrulama kodu gönderildi.' });

    } catch (error: any) {
      console.error('[signup]', error);
      return c.json({ success: false, error: 'Kayıt sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/verify
  app.post('/api/verify', async (c) => {
    try {
      const body  = await c.req.json();
      const email = sanitize(body.email).toLowerCase();
      const code  = sanitize(body.code);

      if (!email || !code || code.length !== 6) {
        return c.json({ success: false, error: 'Geçersiz istek.' }, 400);
      }

      const user = await c.env.DB.prepare(
        `SELECT * FROM users
         WHERE email = ?
           AND verification_code = ?
           AND code_expires_at > datetime('now')`
      ).bind(email, code).first<{ username: string; email: string; role: string; detail: string }>();

      if (!user) {
        return c.json({ success: false, error: 'Kod geçersiz veya süresi dolmuş.' }, 400);
      }

      await c.env.DB.prepare(
        `UPDATE users SET status = 'pending_admin', verification_code = NULL, code_expires_at = NULL WHERE email = ?`
      ).bind(email).run();

      try {
        await sendAdminNotification(c.env, user.username, user.email, user.role, user.detail);
      } catch (notifErr) {
        console.error('[verify] Admin bildirimi gönderilemedi:', notifErr);
      }

      return c.json({ success: true, message: 'Doğrulandı, admin onayı bekleniyor.' });

    } catch (error: any) {
      console.error('[verify]', error);
      return c.json({ success: false, error: 'Doğrulama sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/login
  app.post('/api/login', async (c) => {
    try {
      const body  = await c.req.json();
      const email = sanitize(body.email).toLowerCase();

      if (!email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz e-posta.' }, 400);
      }

      const user = await c.env.DB.prepare(
        'SELECT username, email, role, detail, status FROM users WHERE email = ?'
      ).bind(email).first<{ username: string; email: string; role: string; detail: string; status: string }>();

      if (!user) {
        return c.json({ success: false, error: 'Bu e-posta ile kayıtlı bir hesap bulunamadı.' }, 404);
      }

      return c.json({ success: true, data: user });

    } catch (error: any) {
      console.error('[login]', error);
      return c.json({ success: false, error: 'Giriş sırasında bir hata oluştu.' }, 500);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN YARDIMCI FONKSİYONU
  // ══════════════════════════════════════════════════════════════════════════

  function checkAdminKey(key: string | null, env: Env): boolean {
    return !!key && key === env.ADMIN_KEY;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // KULLANICI YÖNETİMİ (mevcut)
  // ══════════════════════════════════════════════════════════════════════════

  // GET /api/admin/users?key=...
  app.get('/api/admin/users', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) {
      return c.json({ error: 'Yetkisiz erişim.' }, 401);
    }
    const users = await c.env.DB.prepare(
      'SELECT id, username, email, role, detail, status, created_at FROM users ORDER BY created_at DESC'
    ).all();
    return c.json({ success: true, data: users.results });
  });

  // POST /api/admin/update-status
  app.post('/api/admin/update-status', async (c) => {
    try {
      const body   = await c.req.json();
      const key    = sanitize(body.key);
      const email  = sanitize(body.email).toLowerCase();
      const status = sanitize(body.status);

      if (!checkAdminKey(key, c.env)) {
        return c.json({ error: 'Yetkisiz erişim.' }, 401);
      }

      const allowed = ['active', 'rejected', 'pending_admin', 'pending_email'];
      if (!allowed.includes(status)) {
        return c.json({ error: 'Geçersiz durum değeri.' }, 400);
      }

      await c.env.DB.prepare(
        'UPDATE users SET status = ? WHERE email = ?'
      ).bind(status, email).run();

      if (status === 'active' || status === 'rejected') {
        const user = await c.env.DB.prepare(
          'SELECT username FROM users WHERE email = ?'
        ).bind(email).first<{ username: string }>();

        if (user) {
          const isApproved = status === 'active';
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'BCT Akademi <noreply@bctakademi.com>',
              to: [email],
              reply_to: 'destek@bctakademi.com',
              subject: isApproved
                ? 'BCT Akademi — Hesabınız Onaylandı! 🎉'
                : 'BCT Akademi — Başvurunuz Hakkında',
              html: isApproved ? `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
                  <h2 style="color:#0f172a">Merhaba ${user.username} 🎉</h2>
                  <p style="color:#475569">BCT Akademi'ye hoş geldin! Hesabın onaylandı, artık tüm içeriklere erişebilirsin.</p>
                  <div style="text-align:center;margin:32px 0">
                    <a href="https://bctakademi.com/portal"
                       style="background:#f97316;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700">
                      Portala Git →
                    </a>
                  </div>
                  <p style="color:#94a3b8;font-size:12px">Sorularınız için: <a href="mailto:destek@bctakademi.com" style="color:#f97316">destek@bctakademi.com</a></p>
                </div>
              ` : `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
                  <h2 style="color:#0f172a">Merhaba ${user.username}</h2>
                  <p style="color:#475569">Maalesef BCT Akademi'ye üyelik başvurunuz bu aşamada onaylanamamıştır.</p>
                  <p style="color:#475569">Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>
                  <p style="color:#94a3b8;font-size:12px;margin-top:24px">
                    <a href="mailto:destek@bctakademi.com" style="color:#f97316">destek@bctakademi.com</a>
                  </p>
                </div>
              `,
            }),
          });
        }
      }

      return c.json({ success: true, message: 'Durum güncellendi.' });
    } catch (error: any) {
      console.error('[update-status]', error);
      return c.json({ error: 'İşlem sırasında hata oluştu.' }, 500);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // İÇERİK API'LERİ — Public (GET)
  // ══════════════════════════════════════════════════════════════════════════

  // GET /api/curriculum — Tüm kategori > kurs > ünite ağacı
  app.get('/api/curriculum', async (c) => {
    try {
      const categories = await c.env.DB.prepare(
        'SELECT * FROM categories ORDER BY sort_order ASC'
      ).all();

      const courses = await c.env.DB.prepare(
        'SELECT * FROM courses WHERE is_published = 1 ORDER BY category_id, sort_order ASC'
      ).all();

      const units = await c.env.DB.prepare(
        'SELECT id, course_id, title, description, estimated_reading_time, sort_order FROM units WHERE is_published = 1 ORDER BY course_id, sort_order ASC'
      ).all();

      // Ağaç yapısına dönüştür
      const unitsByCourse: Record<string, any[]> = {};
      for (const u of (units.results as any[])) {
        if (!unitsByCourse[u.course_id]) unitsByCourse[u.course_id] = [];
        unitsByCourse[u.course_id].push(u);
      }

      const coursesByCategory: Record<string, any[]> = {};
      for (const course of (courses.results as any[])) {
        const c2 = { ...course, units: unitsByCourse[course.id] ?? [] };
        if (!coursesByCategory[course.category_id]) coursesByCategory[course.category_id] = [];
        coursesByCategory[course.category_id].push(c2);
      }

      const result = (categories.results as any[]).map(cat => ({
        ...cat,
        courses: coursesByCategory[cat.id] ?? [],
      }));

      return c.json({ success: true, data: result });
    } catch (error: any) {
      console.error('[curriculum]', error);
      return c.json({ success: false, error: 'Müfredat yüklenemedi.' }, 500);
    }
  });

  // GET /api/units/:unitId/topics — Bir ünitenin konuları + quizleri
  app.get('/api/units/:unitId/topics', async (c) => {
    try {
      const { unitId } = c.req.param();

      const topics = await c.env.DB.prepare(
        'SELECT * FROM topics WHERE unit_id = ? AND is_published = 1 ORDER BY sort_order ASC'
      ).bind(unitId).all();

      const quizzes = await c.env.DB.prepare(
        `SELECT q.* FROM quiz_questions q
         INNER JOIN topics t ON q.topic_id = t.id
         WHERE t.unit_id = ? ORDER BY q.topic_id, q.sort_order ASC`
      ).bind(unitId).all();

      const quizByTopic: Record<string, any[]> = {};
      for (const q of (quizzes.results as any[])) {
        const options = JSON.parse(q.options || '[]');
        if (!quizByTopic[q.topic_id]) quizByTopic[q.topic_id] = [];
        quizByTopic[q.topic_id].push({ ...q, options });
      }

      const result = (topics.results as any[]).map(t => ({
        ...t,
        quiz: quizByTopic[t.id] ?? [],
      }));

      return c.json({ success: true, data: result });
    } catch (error: any) {
      console.error('[topics]', error);
      return c.json({ success: false, error: 'Konular yüklenemedi.' }, 500);
    }
  });

  // GET /api/blog — Blog yazıları
  app.get('/api/blog', async (c) => {
    try {
      const posts = await c.env.DB.prepare(
        'SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC'
      ).all();
      return c.json({ success: true, data: posts.results });
    } catch (error: any) {
      return c.json({ success: false, error: 'Blog yüklenemedi.' }, 500);
    }
  });

  // GET /api/resources — Kaynaklar
  app.get('/api/resources', async (c) => {
    try {
      const resources = await c.env.DB.prepare(
        'SELECT * FROM resources WHERE is_published = 1 ORDER BY created_at DESC'
      ).all();
      return c.json({ success: true, data: resources.results });
    } catch (error: any) {
      return c.json({ success: false, error: 'Kaynaklar yüklenemedi.' }, 500);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN CMS — Kategori & Kurs & Ünite & Konu
  // ══════════════════════════════════════════════════════════════════════════

  // ── Kategoriler ──────────────────────────────────────────────────────────

  // GET /api/admin/categories?key=...
  app.get('/api/admin/categories', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/categories
  app.post('/api/admin/categories', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const id    = sanitize(body.id) || nanoid();
      const title = sanitize(body.title);
      const sort  = Number(body.sort_order) || 0;
      if (!title) return c.json({ error: 'Başlık gerekli.' }, 400);
      await c.env.DB.prepare('INSERT INTO categories (id, title, sort_order) VALUES (?, ?, ?)')
        .bind(id, title, sort).run();
      return c.json({ success: true, id });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // PUT /api/admin/categories/:id
  app.put('/api/admin/categories/:id', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const { id } = c.req.param();
      await c.env.DB.prepare('UPDATE categories SET title = ?, sort_order = ? WHERE id = ?')
        .bind(sanitize(body.title), Number(body.sort_order) || 0, id).run();
      return c.json({ success: true });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // DELETE /api/admin/categories/:id
  app.delete('/api/admin/categories/:id', async (c) => {
    const key = c.req.query('key');
    if (!checkAdminKey(key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ── Kurslar ──────────────────────────────────────────────────────────────

  // GET /api/admin/courses?key=...
  app.get('/api/admin/courses', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM courses ORDER BY category_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/courses
  app.post('/api/admin/courses', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const id          = sanitize(body.id) || nanoid();
      const categoryId  = sanitize(body.category_id);
      const title       = sanitize(body.title);
      const description = body.description?.slice(0, 2000) ?? '';
      const imageUrl    = sanitize(body.image_url);
      const sort        = Number(body.sort_order) || 0;
      const published   = body.is_published !== false ? 1 : 0;
      if (!categoryId || !title) return c.json({ error: 'Kategori ve başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO courses (id, category_id, title, description, image_url, sort_order, is_published) VALUES (?,?,?,?,?,?,?)'
      ).bind(id, categoryId, title, description, imageUrl, sort, published).run();
      return c.json({ success: true, id });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // PUT /api/admin/courses/:id
  app.put('/api/admin/courses/:id', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE courses SET category_id=?, title=?, description=?, image_url=?, sort_order=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.category_id), sanitize(body.title),
        body.description?.slice(0, 2000) ?? '',
        sanitize(body.image_url), Number(body.sort_order) || 0,
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // DELETE /api/admin/courses/:id
  app.delete('/api/admin/courses/:id', async (c) => {
    const key = c.req.query('key');
    if (!checkAdminKey(key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ── Üniteler ─────────────────────────────────────────────────────────────

  // GET /api/admin/units?key=...&course_id=...
  app.get('/api/admin/units', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const courseId = c.req.query('course_id');
    const r = courseId
      ? await c.env.DB.prepare('SELECT * FROM units WHERE course_id = ? ORDER BY sort_order ASC').bind(courseId).all()
      : await c.env.DB.prepare('SELECT * FROM units ORDER BY course_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/units
  app.post('/api/admin/units', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const id       = sanitize(body.id) || nanoid();
      const courseId = sanitize(body.course_id);
      const title    = sanitize(body.title);
      const desc     = body.description?.slice(0, 1000) ?? '';
      const readTime = sanitize(body.estimated_reading_time);
      const sort     = Number(body.sort_order) || 0;
      const pub      = body.is_published !== false ? 1 : 0;
      if (!courseId || !title) return c.json({ error: 'Kurs ve başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO units (id, course_id, title, description, estimated_reading_time, sort_order, is_published) VALUES (?,?,?,?,?,?,?)'
      ).bind(id, courseId, title, desc, readTime, sort, pub).run();
      return c.json({ success: true, id });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // PUT /api/admin/units/:id
  app.put('/api/admin/units/:id', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE units SET course_id=?, title=?, description=?, estimated_reading_time=?, sort_order=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.course_id), sanitize(body.title),
        body.description?.slice(0, 1000) ?? '',
        sanitize(body.estimated_reading_time),
        Number(body.sort_order) || 0,
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // DELETE /api/admin/units/:id
  app.delete('/api/admin/units/:id', async (c) => {
    const key = c.req.query('key');
    if (!checkAdminKey(key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM units WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ── Konular ──────────────────────────────────────────────────────────────

  // GET /api/admin/topics?key=...&unit_id=...
  app.get('/api/admin/topics', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const unitId = c.req.query('unit_id');
    const r = unitId
      ? await c.env.DB.prepare('SELECT * FROM topics WHERE unit_id = ? ORDER BY sort_order ASC').bind(unitId).all()
      : await c.env.DB.prepare('SELECT * FROM topics ORDER BY unit_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/topics
  app.post('/api/admin/topics', async (c) => {
    try {
      const body    = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const id      = sanitize(body.id) || nanoid();
      const unitId  = sanitize(body.unit_id);
      const title   = sanitize(body.title);
      const content = body.content?.slice(0, 50000) ?? '';
      const sort    = Number(body.sort_order) || 0;
      const pub     = body.is_published !== false ? 1 : 0;
      if (!unitId || !title) return c.json({ error: 'Ünite ve başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO topics (id, unit_id, title, content, sort_order, is_published) VALUES (?,?,?,?,?,?)'
      ).bind(id, unitId, title, content, sort, pub).run();
      return c.json({ success: true, id });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // PUT /api/admin/topics/:id
  app.put('/api/admin/topics/:id', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE topics SET unit_id=?, title=?, content=?, sort_order=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.unit_id), sanitize(body.title),
        body.content?.slice(0, 50000) ?? '',
        Number(body.sort_order) || 0,
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // DELETE /api/admin/topics/:id
  app.delete('/api/admin/topics/:id', async (c) => {
    const key = c.req.query('key');
    if (!checkAdminKey(key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM topics WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN CMS — Blog
  // ══════════════════════════════════════════════════════════════════════════

  // GET /api/admin/blog?key=...
  app.get('/api/admin/blog', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY published_at DESC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/blog
  app.post('/api/admin/blog', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const id       = sanitize(body.id) || nanoid();
      const title    = sanitize(body.title);
      if (!title) return c.json({ error: 'Başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        `INSERT INTO blog_posts (id, title, excerpt, content, author, category, image_url, read_time, featured, is_published, published_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        id, title,
        body.excerpt?.slice(0, 500) ?? '',
        body.content?.slice(0, 100000) ?? '',
        sanitize(body.author),
        sanitize(body.category),
        sanitize(body.image_url),
        sanitize(body.read_time),
        body.featured ? 1 : 0,
        body.is_published !== false ? 1 : 0,
        body.published_at || new Date().toISOString()
      ).run();
      return c.json({ success: true, id });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // PUT /api/admin/blog/:id
  app.put('/api/admin/blog/:id', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE blog_posts SET title=?, excerpt=?, content=?, author=?, category=?, image_url=?, read_time=?, featured=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.title),
        body.excerpt?.slice(0, 500) ?? '',
        body.content?.slice(0, 100000) ?? '',
        sanitize(body.author),
        sanitize(body.category),
        sanitize(body.image_url),
        sanitize(body.read_time),
        body.featured ? 1 : 0,
        body.is_published !== false ? 1 : 0,
        id
      ).run();
      return c.json({ success: true });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // DELETE /api/admin/blog/:id
  app.delete('/api/admin/blog/:id', async (c) => {
    const key = c.req.query('key');
    if (!checkAdminKey(key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN CMS — Kaynaklar
  // ══════════════════════════════════════════════════════════════════════════

  // GET /api/admin/resources?key=...
  app.get('/api/admin/resources', async (c) => {
    if (!checkAdminKey(c.req.query('key'), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM resources ORDER BY created_at DESC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/resources
  app.post('/api/admin/resources', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const id   = sanitize(body.id) || nanoid();
      const type = sanitize(body.type);
      if (!['PDF','Video','Sunum'].includes(type)) return c.json({ error: 'Geçersiz tür.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO resources (id, title, description, type, category, file_url, file_size, duration, is_published) VALUES (?,?,?,?,?,?,?,?,?)'
      ).bind(
        id, sanitize(body.title),
        body.description?.slice(0, 1000) ?? '',
        type,
        sanitize(body.category),
        sanitize(body.file_url),
        sanitize(body.file_size),
        sanitize(body.duration),
        body.is_published !== false ? 1 : 0
      ).run();
      return c.json({ success: true, id });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // PUT /api/admin/resources/:id
  app.put('/api/admin/resources/:id', async (c) => {
    try {
      const body = await c.req.json();
      if (!checkAdminKey(body.key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE resources SET title=?, description=?, type=?, category=?, file_url=?, file_size=?, duration=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.title),
        body.description?.slice(0, 1000) ?? '',
        sanitize(body.type),
        sanitize(body.category),
        sanitize(body.file_url),
        sanitize(body.file_size),
        sanitize(body.duration),
        body.is_published !== false ? 1 : 0,
        id
      ).run();
      return c.json({ success: true });
    } catch (e: any) { return c.json({ error: e.message }, 500); }
  });

  // DELETE /api/admin/resources/:id
  app.delete('/api/admin/resources/:id', async (c) => {
    const key = c.req.query('key');
    if (!checkAdminKey(key, c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // KULLANICI İLERLEMESİ
  // ══════════════════════════════════════════════════════════════════════════

  // POST /api/progress — Bir aktiviteyi tamamla ve XP kazan
  // Body: { email, entity_type, entity_id }
  app.post('/api/progress', async (c) => {
    try {
      const body       = await c.req.json();
      const email      = sanitize(body.email).toLowerCase();
      const entityType = sanitize(body.entity_type) as 'topic' | 'unit' | 'video' | 'resource' | 'quiz';
      const entityId   = sanitize(body.entity_id);

      if (!email || !entityType || !entityId) {
        return c.json({ error: 'Eksik parametre.' }, 400);
      }

      const xpMap: Record<string, number> = {
        topic: 10, unit: 100, video: 20, resource: 10, quiz: 15,
      };
      const xp = xpMap[entityType] ?? 0;

      // UPSERT — zaten tamamlanmışsa tekrar XP verme
      const existing = await c.env.DB.prepare(
        'SELECT id FROM user_progress WHERE user_email = ? AND entity_type = ? AND entity_id = ?'
      ).bind(email, entityType, entityId).first();

      if (!existing) {
        await c.env.DB.prepare(
          'INSERT INTO user_progress (user_email, entity_type, entity_id, xp_earned) VALUES (?,?,?,?)'
        ).bind(email, entityType, entityId, xp).run();
        await addXP(c.env, email, xp);
      }

      return c.json({ success: true, xp_earned: existing ? 0 : xp });
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  });

  // GET /api/progress?email=... — Kullanıcının tüm ilerlemesi
  app.get('/api/progress', async (c) => {
    const email = c.req.query('email')?.toLowerCase();
    if (!email) return c.json({ error: 'Email gerekli.' }, 400);
    const r = await c.env.DB.prepare(
      'SELECT entity_type, entity_id, xp_earned, completed_at FROM user_progress WHERE user_email = ?'
    ).bind(email).all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/progress/sync — localStorage'dan toplu senkronizasyon
  // Body: { email, progress: [{entity_type, entity_id}] }
  app.post('/api/progress/sync', async (c) => {
    try {
      const body     = await c.req.json();
      const email    = sanitize(body.email).toLowerCase();
      const progress = Array.isArray(body.progress) ? body.progress : [];

      if (!email) return c.json({ error: 'Email gerekli.' }, 400);

      const xpMap: Record<string, number> = {
        topic: 10, unit: 100, video: 20, resource: 10, quiz: 15,
      };

      let totalNewXP = 0;
      for (const item of progress.slice(0, 500)) {
        const entityType = sanitize(item.entity_type);
        const entityId   = sanitize(item.entity_id);
        if (!entityType || !entityId) continue;

        const existing = await c.env.DB.prepare(
          'SELECT id FROM user_progress WHERE user_email = ? AND entity_type = ? AND entity_id = ?'
        ).bind(email, entityType, entityId).first();

        if (!existing) {
          const xp = xpMap[entityType] ?? 0;
          await c.env.DB.prepare(
            'INSERT INTO user_progress (user_email, entity_type, entity_id, xp_earned) VALUES (?,?,?,?)'
          ).bind(email, entityType, entityId, xp).run();
          totalNewXP += xp;
        }
      }

      if (totalNewXP > 0) await addXP(c.env, email, totalNewXP);

      return c.json({ success: true, xp_synced: totalNewXP });
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // LİDERLİK TABLOSU
  // ══════════════════════════════════════════════════════════════════════════

  // GET /api/leaderboard?period=all|weekly|monthly&limit=50
  app.get('/api/leaderboard', async (c) => {
    try {
      const period = c.req.query('period') || 'all';
      const limit  = Math.min(Number(c.req.query('limit')) || 50, 100);

      const xpCol = period === 'weekly' ? 'weekly_xp'
                  : period === 'monthly' ? 'monthly_xp'
                  : 'total_xp';

      const rows = await c.env.DB.prepare(`
        SELECT
          x.user_email,
          x.${xpCol} AS xp,
          u.username,
          u.avatar
        FROM user_xp x
        LEFT JOIN users u ON u.email = x.user_email
        WHERE u.status = 'active'
          AND x.${xpCol} > 0
        ORDER BY x.${xpCol} DESC
        LIMIT ?
      `).bind(limit).all();

      // Gizlilik: "Ad S." formatına çevir....
      const data = (rows.results as any[]).map((row, i) => {
        const parts = (row.username || '').trim().split(' ');
        const display = parts.length >= 2
          ? `${parts[0]} ${parts[parts.length - 1][0]}.`
          : parts[0] || 'Kullanıcı';
        return {
          rank:     i + 1,
          username: display,
          avatar:   row.avatar || null,
          xp:       row.xp,
          // email hiçbir zaman dönmüyor
        };
      });

      return c.json({ success: true, data, period });
    } catch (e: any) {
      console.error('[leaderboard]', e);
      return c.json({ error: 'Liderlik tablosu yüklenemedi.' }, 500);
    }
  });

  // GET /api/leaderboard/me?email=...&period=all|weekly|monthly
  // Kullanıcının kendi sırası
  app.get('/api/leaderboard/me', async (c) => {
    try {
      const email  = c.req.query('email')?.toLowerCase();
      const period = c.req.query('period') || 'all';
      if (!email) return c.json({ error: 'Email gerekli.' }, 400);

      const xpCol = period === 'weekly' ? 'weekly_xp'
                  : period === 'monthly' ? 'monthly_xp'
                  : 'total_xp';

      const myXP = await c.env.DB.prepare(
        `SELECT ${xpCol} AS xp FROM user_xp WHERE user_email = ?`
      ).bind(email).first<{ xp: number }>();

      if (!myXP) return c.json({ success: true, rank: null, xp: 0 });

      const above = await c.env.DB.prepare(
        `SELECT COUNT(*) as cnt FROM user_xp x
         LEFT JOIN users u ON u.email = x.user_email
         WHERE u.status = 'active' AND x.${xpCol} > ?`
      ).bind(myXP.xp).first<{ cnt: number }>();

      return c.json({
        success: true,
        rank: (above?.cnt ?? 0) + 1,
        xp: myXP.xp,
        period,
      });
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  });
}
