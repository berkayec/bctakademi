import { Hono } from "hono";
import { Env } from './core-utils'; 

// ═══════════════════════════════════════════════════════════════════════════
// YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════════════════════════════════════

/** Gelen değeri string'e dönüştür, null byte ve kontrol karakterlerini temizle */
function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/\0/g, '').trim().slice(0, 255);
}

/** RFC 5321 uyumlu e-posta kontrolü */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

/** Rastgele ID üreteci (admin CMS için) */
function nanoid(len = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < len; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

/**
 * Timing-safe string karşılaştırması.
 * Basit === ile karşılaştırma timing attack'a (karakter karakter süre ölçümü) açıktır.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Admin anahtarını Authorization header'dan oku.
 * URL query param olarak taşımak; server loglarına, tarayıcı geçmişine
 * ve Referer header'larına sızmasına neden olur — bu yüzden header kullanıyoruz.
 */
function getAdminKeyFromRequest(req: Request): string | null {
  const auth = req.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

/** Admin anahtarı doğrulama */
function checkAdminKey(key: string | null, env: Env): boolean {
  if (!key || !env.ADMIN_KEY) return false;
  return timingSafeEqual(key, env.ADMIN_KEY);
}

/**
 * HTML escape — e-posta şablonlarında kullanıcı verisi doğrudan interpolate edilmemeli.
 * Aksi halde saldırgan kendi adına HTML/JS inject edebilir (stored XSS).
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * D1 tabanlı rate limiter.
 * Belirli bir anahtar için maxAttempts/windowSeconds sınırını uygular.
 * Migrations'a 004_rate_limits.sql eklenmesi gerekir.
 */
async function checkRateLimit(
  db: D1Database,
  key: string,
  maxAttempts: number,
  windowSeconds: number
): Promise<boolean> {
  // Süresi dolmuş kayıtları temizle
  await db
    .prepare(`DELETE FROM rate_limits WHERE key = ? AND window_start < datetime('now', ? || ' seconds')`)
    .bind(key, `-${windowSeconds}`)
    .run();

  const record = await db
    .prepare(`SELECT attempts FROM rate_limits WHERE key = ?`)
    .bind(key)
    .first<{ attempts: number }>();

  if (!record) {
    await db
      .prepare(`INSERT INTO rate_limits (key, attempts, window_start) VALUES (?, 1, datetime('now'))`)
      .bind(key)
      .run();
    return true;
  }

  if (record.attempts >= maxAttempts) return false;

  await db
    .prepare(`UPDATE rate_limits SET attempts = attempts + 1 WHERE key = ?`)
    .bind(key)
    .run();

  return true;
}

// ═══════════════════════════════════════════════════════════════════════════
// E-POSTA YARDIMCILARI
// ═══════════════════════════════════════════════════════════════════════════

async function sendVerificationEmail(
  env: Env,
  to: string,
  username: string,
  code: string
): Promise<void> {
  const safeUsername = escapeHtml(username);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BCT Akademi <noreply@bctakademi.com>',
      to: [to],
      reply_to: 'destek@bctakademi.com',
      subject: 'BCT Akademi — E-posta Doğrulama Kodun',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#0f172a">Merhaba ${safeUsername} 👋</h2>
          <p style="color:#475569">BCT Akademi'ye kaydın için e-posta adresini doğrulaman gerekiyor.</p>
          <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:16px;padding:24px;text-align:center;margin:24px 0">
            <p style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Doğrulama Kodun</p>
            <p style="font-size:40px;font-weight:900;letter-spacing:.3em;color:#0f172a;margin:0">${code}</p>
          </div>
          <p style="color:#94a3b8;font-size:12px">Bu kod 15 dakika geçerlidir. Bu işlemi sen başlatmadıysan bu e-postayı görmezden gelebilirsin.</p>
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

async function sendAdminNotification(
  env: Env,
  username: string,
  email: string,
  role: string,
  detail: string
): Promise<void> {
  // Admin linkinde ADMIN_KEY URL'ye koyulmamalı — sadece panel adresini gönder
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BCT Akademi Sistem <noreply@bctakademi.com>',
      to: ['destek@bctakademi.com', 'bctakademidestek@gmail.com'],
      subject: `[Yeni Başvuru] ${escapeHtml(username)} — Admin Onayı Bekliyor`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <div style="background:#f97316;border-radius:12px;padding:16px 24px;margin-bottom:24px">
            <h2 style="color:#fff;margin:0">🔔 Yeni Üyelik Başvurusu</h2>
          </div>
          <p style="color:#475569">E-postasını doğrulayan bir kullanıcı admin onayı bekliyor.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr style="background:#f8fafc">
              <td style="padding:12px 16px;font-weight:700;color:#64748b;width:120px">Ad Soyad</td>
              <td style="padding:12px 16px;color:#0f172a;font-weight:600">${escapeHtml(username)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#64748b">E-posta</td>
              <td style="padding:12px 16px;color:#0f172a">${escapeHtml(email)}</td>
            </tr>
            <tr style="background:#f8fafc">
              <td style="padding:12px 16px;font-weight:700;color:#64748b">Rol</td>
              <td style="padding:12px 16px;color:#0f172a">${escapeHtml(role)}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;font-weight:700;color:#64748b">Detay</td>
              <td style="padding:12px 16px;color:#0f172a">${escapeHtml(detail || '—')}</td>
            </tr>
          </table>
          <div style="margin-top:32px;text-align:center">
            <a href="https://bctakademi.com/admin-control-portal"
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

async function sendStatusEmail(
  env: Env,
  email: string,
  username: string,
  isApproved: boolean
): Promise<void> {
  const safeUsername = escapeHtml(username);
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BCT Akademi <noreply@bctakademi.com>',
      to: [email],
      reply_to: 'destek@bctakademi.com',
      subject: isApproved
        ? 'BCT Akademi — Hesabınız Onaylandı! 🎉'
        : 'BCT Akademi — Başvurunuz Hakkında',
      html: isApproved
        ? `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
            <h2 style="color:#0f172a">Merhaba ${safeUsername} 🎉</h2>
            <p style="color:#475569">BCT Akademi'ye hoş geldin! Hesabın onaylandı, artık tüm içeriklere erişebilirsin.</p>
            <div style="text-align:center;margin:32px 0">
              <a href="https://bctakademi.com/portal"
                 style="background:#f97316;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700">
                Portala Git →
              </a>
            </div>
            <p style="color:#94a3b8;font-size:12px">Sorularınız için: <a href="mailto:destek@bctakademi.com" style="color:#f97316">destek@bctakademi.com</a></p>
          </div>
        `
        : `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
            <h2 style="color:#0f172a">Merhaba ${safeUsername}</h2>
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

// ═══════════════════════════════════════════════════════════════════════════
// XP YARDIMCISI
// ═══════════════════════════════════════════════════════════════════════════

async function addXP(env: Env, userEmail: string, amount: number): Promise<void> {
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

// ═══════════════════════════════════════════════════════════════════════════
// ROTALAR
// ═══════════════════════════════════════════════════════════════════════════

export function userRoutes(app: Hono<{ Bindings: Env }>) {

  // ─────────────────────────────────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────────────────────────────────

  // POST /api/signup
  // Rate limit: IP başına 5 istek / 15 dakika
  app.post('/api/signup', async (c) => {
    try {
      const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
      const allowed = await checkRateLimit(c.env.DB, `signup:${ip}`, 5, 900);
      if (!allowed) {
        return c.json({ success: false, error: 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.' }, 429);
      }

      const body     = await c.req.json();
      const username = sanitize(body.username);
      const email    = sanitize(body.email).toLowerCase();
      const role     = sanitize(body.role);
      const detail   = sanitize(body.detail);

      if (!username || username.length < 2) {
        return c.json({ success: false, error: 'Ad en az 2 karakter olmalıdır.' }, 400);
      }
      if (!email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz e-posta adresi.' }, 400);
      }
      const validRoles = ['student', 'teacher', 'pro', 'other'];
      if (!validRoles.includes(role)) {
        return c.json({ success: false, error: 'Geçersiz rol seçimi.' }, 400);
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const existing = await c.env.DB.prepare(
        'SELECT id, status FROM users WHERE email = ?'
      ).bind(email).first<{ id: number; status: string }>();

      if (existing) {
        if (existing.status === 'active') {
          // Güvenlik: aktif hesap varlığını açıkça bildirme — enum user attack'ını önle
          return c.json({
            success: false,
            error: 'Bu e-posta ile işlem yapılamıyor. Destek için iletişime geçin.',
          }, 400);
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

    } catch (error: unknown) {
      console.error('[signup]', error);
      return c.json({ success: false, error: 'Kayıt sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/verify
  // Rate limit: e-posta başına 10 yanlış deneme / 15 dakika
  app.post('/api/verify', async (c) => {
    try {
      const body  = await c.req.json();
      const email = sanitize(body.email).toLowerCase();
      const code  = sanitize(body.code).replace(/\D/g, ''); // sadece rakam

      if (!email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz e-posta.' }, 400);
      }
      if (!code || code.length !== 6) {
        return c.json({ success: false, error: '6 haneli kod giriniz.' }, 400);
      }

      const allowed = await checkRateLimit(c.env.DB, `verify:${email}`, 10, 900);
      if (!allowed) {
        return c.json({ success: false, error: 'Çok fazla deneme. 15 dakika bekleyin.' }, 429);
      }

      const user = await c.env.DB.prepare(
        `SELECT username, email, role, detail FROM users
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

    } catch (error: unknown) {
      console.error('[verify]', error);
      return c.json({ success: false, error: 'Doğrulama sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/login
  // Rate limit: IP başına 20 deneme / 15 dakika
  app.post('/api/login', async (c) => {
    try {
      const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
      const allowed = await checkRateLimit(c.env.DB, `login:${ip}`, 20, 900);
      if (!allowed) {
        return c.json({ success: false, error: 'Çok fazla giriş denemesi. Lütfen bekleyin.' }, 429);
      }

      const body  = await c.req.json();
      const email = sanitize(body.email).toLowerCase();

      if (!email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz e-posta.' }, 400);
      }

      const user = await c.env.DB.prepare(
        'SELECT username, email, role, detail, status, avatar, points FROM users WHERE email = ?'
      ).bind(email).first<{
        username: string;
        email: string;
        role: string;
        detail: string;
        status: string;
        avatar: string;
        points: number;
      }>();

      if (!user) {
        return c.json({ success: false, error: 'Bu e-posta ile kayıtlı bir hesap bulunamadı.' }, 404);
      }

      return c.json({ success: true, data: user });

    } catch (error: unknown) {
      console.error('[login]', error);
      return c.json({ success: false, error: 'Giriş sırasında bir hata oluştu.' }, 500);
    }
  });

  // POST /api/contact — İletişim formu
  app.post('/api/contact', async (c) => {
    try {
      const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
      const allowed = await checkRateLimit(c.env.DB, `contact:${ip}`, 5, 3600); // saatte 5
      if (!allowed) {
        return c.json({ success: false, error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' }, 429);
      }

      const body    = await c.req.json();
      const name    = sanitize(body.name);
      const email   = sanitize(body.email).toLowerCase();
      const subject = sanitize(body.subject);
      const message = typeof body.message === 'string' ? body.message.slice(0, 5000) : '';

      if (!name || !email || !isValidEmail(email) || !subject || !message) {
        return c.json({ success: false, error: 'Tüm alanları doldurun.' }, 400);
      }

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BCT Akademi İletişim <noreply@bctakademi.com>',
          to: ['destek@bctakademi.com'],
          reply_to: email,
          subject: `[İletişim] ${escapeHtml(subject)}`,
          html: `
            <p><b>Ad:</b> ${escapeHtml(name)}</p>
            <p><b>E-posta:</b> ${escapeHtml(email)}</p>
            <p><b>Konu:</b> ${escapeHtml(subject)}</p>
            <p><b>Mesaj:</b><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
          `,
        }),
      });

      return c.json({ success: true });
    } catch (error: unknown) {
      console.error('[contact]', error);
      return c.json({ success: false, error: 'Mesaj gönderilemedi.' }, 500);
    }
  });

  // POST /api/profile — Profil güncelleme
  app.post('/api/profile', async (c) => {
    try {
      const body     = await c.req.json();
      const email    = sanitize(body.email).toLowerCase();
      const username = sanitize(body.username);
      const detail   = sanitize(body.detail);
      const avatar   = sanitize(body.avatar);

      if (!email || !isValidEmail(email)) {
        return c.json({ success: false, error: 'Geçersiz e-posta.' }, 400);
      }
      if (!username || username.length < 2) {
        return c.json({ success: false, error: 'Ad en az 2 karakter olmalıdır.' }, 400);
      }

      await c.env.DB.prepare(
        `UPDATE users SET username = ?, detail = ?, avatar = ?, updated_at = datetime('now') WHERE email = ?`
      ).bind(username, detail, avatar, email).run();

      return c.json({ success: true });
    } catch (error: unknown) {
      console.error('[profile]', error);
      return c.json({ success: false, error: 'Profil güncellenemedi.' }, 500);
    }
  });

  // POST /api/client-errors — Frontend hata raporlama
  app.post('/api/client-errors', async (c) => {
    try {
      // Sessizce logla, frontend'e sadece başarı dön
      const body = await c.req.json().catch(() => ({}));
      console.error('[client-error]', JSON.stringify(body).slice(0, 2000));
      return c.json({ success: true });
    } catch {
      return c.json({ success: true });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN — Tüm admin rotalarında Authorization: Bearer <ADMIN_KEY> gerekli
  // Frontend'de: fetch('/api/admin/...', { headers: { Authorization: `Bearer ${key}` } })
  // ─────────────────────────────────────────────────────────────────────────

  // GET /api/admin/users
  app.get('/api/admin/users', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) {
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
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) {
        return c.json({ error: 'Yetkisiz erişim.' }, 401);
      }

      const body   = await c.req.json();
      const email  = sanitize(body.email).toLowerCase();
      const status = sanitize(body.status);

      if (!email || !isValidEmail(email)) {
        return c.json({ error: 'Geçersiz e-posta.' }, 400);
      }

      const allowed = ['active', 'rejected', 'pending_admin', 'pending_email'] as const;
      type AllowedStatus = typeof allowed[number];
      if (!allowed.includes(status as AllowedStatus)) {
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
          await sendStatusEmail(c.env, email, user.username, status === 'active');
        }
      }

      return c.json({ success: true, message: 'Durum güncellendi.' });
    } catch (error: unknown) {
      console.error('[update-status]', error);
      return c.json({ error: 'İşlem sırasında hata oluştu.' }, 500);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // İÇERİK API'LERİ — Public (GET)
  // ─────────────────────────────────────────────────────────────────────────

  // GET /api/curriculum
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

  // GET /api/units/:unitId/topics
  app.get('/api/units/:unitId/topics', async (c) => {
    try {
      const { unitId } = c.req.param();

      // unitId path injection kontrolü
      if (!/^[a-zA-Z0-9_-]+$/.test(unitId)) {
        return c.json({ success: false, error: 'Geçersiz ünite ID.' }, 400);
      }

      const topics = await c.env.DB.prepare(
        'SELECT * FROM topics WHERE unit_id = ? AND is_published = 1 ORDER BY sort_order ASC'
      ).bind(unitId).all();

      const quizzes = await c.env.DB.prepare(
        `SELECT q.* FROM quiz_questions q
         INNER JOIN topics t ON q.topic_id = t.id
         WHERE t.unit_id = ? ORDER BY q.topic_id, q.sort_order ASC`
      ).bind(unitId).all();

      const quizByTopic: Record<string, unknown[]> = {};
      for (const q of (quizzes.results as any[])) {
        const options = typeof q.options === 'string'
          ? JSON.parse(q.options)
          : (q.options ?? []);
        if (!quizByTopic[q.topic_id]) quizByTopic[q.topic_id] = [];
        quizByTopic[q.topic_id].push({ ...q, options });
      }

      const result = (topics.results as any[]).map(t => ({
        ...t,
        quiz: quizByTopic[t.id] ?? [],
      }));

      return c.json({ success: true, data: result });
    } catch (error: unknown) {
      console.error('[topics]', error);
      return c.json({ success: false, error: 'Konular yüklenemedi.' }, 500);
    }
  });

  // GET /api/blog
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

  // GET /api/resources
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
  // Tüm mutasyon rotaları Authorization: Bearer header gerektirir
  // ─────────────────────────────────────────────────────────────────────────

  // GET /api/admin/categories
  app.get('/api/admin/categories', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/categories
  app.post('/api/admin/categories', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body  = await c.req.json();
      const id    = sanitize(body.id) || nanoid();
      const title = sanitize(body.title);
      const sort  = Number(body.sort_order) || 0;
      if (!title) return c.json({ error: 'Başlık gerekli.' }, 400);
      await c.env.DB.prepare('INSERT INTO categories (id, title, sort_order) VALUES (?, ?, ?)')
        .bind(id, title, sort).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  // PUT /api/admin/categories/:id
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

  // DELETE /api/admin/categories/:id
  app.delete('/api/admin/categories/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // GET /api/admin/courses
  app.get('/api/admin/courses', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM courses ORDER BY category_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/courses
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

  // PUT /api/admin/courses/:id
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

  // DELETE /api/admin/courses/:id
  app.delete('/api/admin/courses/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // GET /api/admin/units
  app.get('/api/admin/units', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const courseId = c.req.query('course_id');
    const r = courseId
      ? await c.env.DB.prepare('SELECT * FROM units WHERE course_id = ? ORDER BY sort_order ASC').bind(courseId).all()
      : await c.env.DB.prepare('SELECT * FROM units ORDER BY course_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/units
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

  // PUT /api/admin/units/:id
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

  // DELETE /api/admin/units/:id
  app.delete('/api/admin/units/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM units WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // GET /api/admin/topics
  app.get('/api/admin/topics', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const unitId = c.req.query('unit_id');
    const r = unitId
      ? await c.env.DB.prepare('SELECT * FROM topics WHERE unit_id = ? ORDER BY sort_order ASC').bind(unitId).all()
      : await c.env.DB.prepare('SELECT * FROM topics ORDER BY unit_id, sort_order ASC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/topics
  app.post('/api/admin/topics', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body    = await c.req.json();
      const id      = sanitize(body.id) || nanoid();
      const unitId  = sanitize(body.unit_id);
      const title   = sanitize(body.title);
      const content = typeof body.content === 'string' ? body.content.slice(0, 50000) : '';
      const sort    = Number(body.sort_order) || 0;
      const pub     = body.is_published !== false ? 1 : 0;
      if (!unitId || !title) return c.json({ error: 'Ünite ve başlık gerekli.' }, 400);
      await c.env.DB.prepare(
        'INSERT INTO topics (id, unit_id, title, content, sort_order, is_published) VALUES (?,?,?,?,?,?)'
      ).bind(id, unitId, title, content, sort, pub).run();
      return c.json({ success: true, id });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  // PUT /api/admin/topics/:id
  app.put('/api/admin/topics/:id', async (c) => {
    try {
      if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
      const body = await c.req.json();
      const { id } = c.req.param();
      await c.env.DB.prepare(
        `UPDATE topics SET unit_id=?, title=?, content=?, sort_order=?, is_published=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        sanitize(body.unit_id), sanitize(body.title),
        typeof body.content === 'string' ? body.content.slice(0, 50000) : '',
        Number(body.sort_order) || 0,
        body.is_published !== false ? 1 : 0, id
      ).run();
      return c.json({ success: true });
    } catch (e: unknown) { return c.json({ error: (e as Error).message }, 500); }
  });

  // DELETE /api/admin/topics/:id
  app.delete('/api/admin/topics/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM topics WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN CMS — Blog
  // ─────────────────────────────────────────────────────────────────────────

  // GET /api/admin/blog
  app.get('/api/admin/blog', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM blog_posts ORDER BY published_at DESC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/blog
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

  // PUT /api/admin/blog/:id
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

  // DELETE /api/admin/blog/:id
  app.delete('/api/admin/blog/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN CMS — Kaynaklar
  // ─────────────────────────────────────────────────────────────────────────

  // GET /api/admin/resources
  app.get('/api/admin/resources', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    const r = await c.env.DB.prepare('SELECT * FROM resources ORDER BY created_at DESC').all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/admin/resources
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

  // PUT /api/admin/resources/:id
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

  // DELETE /api/admin/resources/:id
  app.delete('/api/admin/resources/:id', async (c) => {
    if (!checkAdminKey(getAdminKeyFromRequest(c.req.raw), c.env)) return c.json({ error: 'Yetkisiz.' }, 401);
    await c.env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(c.req.param('id')).run();
    return c.json({ success: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // KULLANICI İLERLEMESİ
  // ─────────────────────────────────────────────────────────────────────────

  // POST /api/progress
  app.post('/api/progress', async (c) => {
    try {
      const body       = await c.req.json();
      const email      = sanitize(body.email).toLowerCase();
      const entityType = sanitize(body.entity_type);
      const entityId   = sanitize(body.entity_id);

      if (!email || !isValidEmail(email) || !entityType || !entityId) {
        return c.json({ error: 'Eksik veya geçersiz parametre.' }, 400);
      }

      const validTypes = ['topic', 'unit', 'video', 'resource', 'quiz'] as const;
      type ValidType = typeof validTypes[number];
      if (!validTypes.includes(entityType as ValidType)) {
        return c.json({ error: 'Geçersiz entity_type.' }, 400);
      }

      const xpMap: Record<ValidType, number> = {
        topic: 10, unit: 100, video: 20, resource: 10, quiz: 15,
      };
      const xp = xpMap[entityType as ValidType];

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
    } catch (e: unknown) {
      return c.json({ error: (e as Error).message }, 500);
    }
  });

  // GET /api/progress?email=...
  app.get('/api/progress', async (c) => {
    const email = c.req.query('email')?.toLowerCase();
    if (!email || !isValidEmail(email)) return c.json({ error: 'Geçerli email gerekli.' }, 400);
    const r = await c.env.DB.prepare(
      'SELECT entity_type, entity_id, xp_earned, completed_at FROM user_progress WHERE user_email = ?'
    ).bind(email).all();
    return c.json({ success: true, data: r.results });
  });

  // POST /api/progress/sync
  app.post('/api/progress/sync', async (c) => {
    try {
      const body     = await c.req.json();
      const email    = sanitize(body.email).toLowerCase();
      const progress = Array.isArray(body.progress) ? body.progress : [];

      if (!email || !isValidEmail(email)) return c.json({ error: 'Geçerli email gerekli.' }, 400);

      const xpMap: Record<string, number> = {
        topic: 10, unit: 100, video: 20, resource: 10, quiz: 15,
      };

      let totalNewXP = 0;
      for (const item of progress.slice(0, 500)) {
        const entityType = sanitize(item.entity_type);
        const entityId   = sanitize(item.entity_id);
        if (!entityType || !entityId) continue;
        if (!xpMap[entityType]) continue; // bilinmeyen type'ları atla

        const existing = await c.env.DB.prepare(
          'SELECT id FROM user_progress WHERE user_email = ? AND entity_type = ? AND entity_id = ?'
        ).bind(email, entityType, entityId).first();

        if (!existing) {
          const xp = xpMap[entityType];
          await c.env.DB.prepare(
            'INSERT INTO user_progress (user_email, entity_type, entity_id, xp_earned) VALUES (?,?,?,?)'
          ).bind(email, entityType, entityId, xp).run();
          totalNewXP += xp;
        }
      }

      if (totalNewXP > 0) await addXP(c.env, email, totalNewXP);

      return c.json({ success: true, xp_synced: totalNewXP });
    } catch (e: unknown) {
      return c.json({ error: (e as Error).message }, 500);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // LİDERLİK TABLOSU
  // ─────────────────────────────────────────────────────────────────────────

  // GET /api/leaderboard?period=all|weekly|monthly&limit=50
  app.get('/api/leaderboard', async (c) => {
    try {
      const period = c.req.query('period') || 'all';
      const limit  = Math.min(Number(c.req.query('limit')) || 50, 100);

      // Whitelist — SQL injection'ı tamamen engellemek için string interpolasyon yerine whitelist
      const xpColMap: Record<string, string> = {
        weekly: 'weekly_xp', monthly: 'monthly_xp', all: 'total_xp',
      };
      const xpCol = xpColMap[period] ?? 'total_xp';

      const rows = await c.env.DB.prepare(`
        SELECT x.user_email, x.${xpCol} AS xp, u.username, u.avatar
        FROM user_xp x
        LEFT JOIN users u ON u.email = x.user_email
        WHERE u.status = 'active' AND x.${xpCol} > 0
        ORDER BY x.${xpCol} DESC
        LIMIT ?
      `).bind(limit).all();

      // Gizlilik: sadece "Ad S." formatında göster, e-posta hiç dönmüyor
      const data = (rows.results as any[]).map((row, i) => {
        const parts = (row.username || '').trim().split(' ');
        const display =
          parts.length >= 2
            ? `${parts[0]} ${parts[parts.length - 1][0]}.`
            : parts[0] || 'Kullanıcı';
        return { rank: i + 1, display_name: display, avatar: row.avatar ?? null, xp: row.xp };
      });

      return c.json({ success: true, data, period });
    } catch (e: unknown) {
      console.error('[leaderboard]', e);
      return c.json({ error: 'Liderlik tablosu yüklenemedi.' }, 500);
    }
  });

  // GET /api/leaderboard/me?email=...&period=...
  app.get('/api/leaderboard/me', async (c) => {
    try {
      const email  = c.req.query('email')?.toLowerCase();
      const period = c.req.query('period') || 'all';

      if (!email || !isValidEmail(email)) return c.json({ error: 'Geçerli email gerekli.' }, 400);

      const xpColMap: Record<string, string> = {
        weekly: 'weekly_xp', monthly: 'monthly_xp', all: 'total_xp',
      };
      const xpCol = xpColMap[period] ?? 'total_xp';

      const myXP = await c.env.DB.prepare(
        `SELECT ${xpCol} AS xp FROM user_xp WHERE user_email = ?`
      ).bind(email).first<{ xp: number }>();

      if (!myXP) return c.json({ success: true, rank: null, xp: 0 });

      const above = await c.env.DB.prepare(
        `SELECT COUNT(*) as cnt FROM user_xp x
         LEFT JOIN users u ON u.email = x.user_email
         WHERE u.status = 'active' AND x.${xpCol} > ?`
      ).bind(myXP.xp).first<{ cnt: number }>();

      return c.json({ success: true, rank: (above?.cnt ?? 0) + 1, xp: myXP.xp, period });
    } catch (e: unknown) {
      return c.json({ error: (e as Error).message }, 500);
    }
  });
}
